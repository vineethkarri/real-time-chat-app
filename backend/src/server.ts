import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';
import { Message, Room } from './types';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const rooms: Map<string, Room> = new Map();

io.use(authMiddleware);

io.on('connection', (socket: Socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ roomId, user }: { roomId: string; user: string }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, { messages: [], users: [] });
    const room = rooms.get(roomId);
    if (room && !room.users.includes(user)) room.users.push(user);
    io.to(roomId).emit('userList', room?.users || []);
    io.emit('roomList', Array.from(rooms.keys()));
  });

  socket.on('sendMessage', ({ roomId, user, text }: { roomId: string; user: string; text: string }) => {
    const room = rooms.get(roomId);
    if (room) {
      const message: Message = { user, text, timestamp: Date.now() };
      room.messages.push(message);
      io.to(roomId).emit('message', message);
    }
  });

  socket.on('createRoom', ({ roomId }: { roomId: string }) => {
    if (!rooms.has(roomId)) rooms.set(roomId, { messages: [], users: [] });
    io.emit('roomList', Array.from(rooms.keys()));
  });

  socket.on('leaveRoom', ({ roomId, user }: { roomId: string; user: string }) => {
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if (room) {
      room.users = room.users.filter(u => u !== user);
      io.to(roomId).emit('userList', room.users);
      if (room.users.length === 0 && room.messages.length === 0) {
        rooms.delete(roomId);
        io.emit('roomList', Array.from(rooms.keys()));
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      room.users = room.users.filter(user => user !== socket.handshake.auth.user);
      io.to(roomId).emit('userList', room.users);
      if (room.users.length === 0 && room.messages.length === 0) {
        rooms.delete(roomId);
      }
    });
    io.emit('roomList', Array.from(rooms.keys()));
  });
});

app.get('/rooms', (req: express.Request, res: express.Response) => res.json(Array.from(rooms.keys())));

httpServer.listen(3001, () => console.log('Server running on port 3001'));