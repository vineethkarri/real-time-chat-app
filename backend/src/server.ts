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

// In-memory storage for rooms and messages
const rooms: Map<string, Room> = new Map();

io.use(authMiddleware);

io.on('connection', (socket: Socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('joinRoom', ({ roomId, user }: { roomId: string; user: string }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, { messages: [], users: [] });
    const room = rooms.get(roomId);
    if (room) room.users.push(user);
    io.to(roomId).emit('userList', room?.users || []);
    io.emit('roomList', Array.from(rooms.keys()));
  });

  // Handle messages
  socket.on('sendMessage', ({ roomId, user, text }: { roomId: string; user: string; text: string }) => {
    const room = rooms.get(roomId);
    if (room) {
      const message: Message = { user, text, timestamp: Date.now() };
      room.messages.push(message);
      io.to(roomId).emit('message', message);
    }
  });

  // Create room
  socket.on('createRoom', ({ roomId }: { roomId: string }) => {
    if (!rooms.has(roomId)) rooms.set(roomId, { messages: [], users: [] });
    io.emit('roomList', Array.from(rooms.keys()));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Update user lists in rooms (simplified: iterate if needed)
  });
});

app.get('/rooms', (req: express.Request, res: express.Response) => res.json(Array.from(rooms.keys())));

httpServer.listen(3001, () => console.log('Server running on port 3001'));