import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { io as Client } from 'socket.io-client';
import { Message, Room } from '../src/types';

// Mock authMiddleware to bypass authentication
jest.mock('../src/middleware/auth', () => ({
  authMiddleware: (socket: Socket, next: (err?: Error) => void) => {
    socket.handshake.auth.user = 'TestUser';
    next();
  },
}));

describe('Chat Server', () => {
  let io: Server, server: any, clientSocket: any, port: number;

  beforeAll((done) => {
    server = createServer();
    io = new Server(server, { cors: { origin: '*' } });

    // Apply mocked authMiddleware
    io.use(require('../src/middleware/auth').authMiddleware);

    server.listen(0, () => { // Use port 0 for dynamic port allocation
      port = (server.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`, { auth: { token: 'test-token' } });
      clientSocket.on('connect', done);
    });
  });

  afterAll((done) => {
    io.close();
    clientSocket.close();
    server.close(done);
  });

  beforeEach(() => {
    // Clear rooms before each test
    (io as any).sockets.sockets.clear();
    (global as any).rooms = new Map<string, Room>();
  });

  test('should handle joinRoom event', (done) => {
    clientSocket.emit('joinRoom', { roomId: 'test-room', user: 'TestUser' });
    clientSocket.on('userList', (users: string[]) => {
      expect(users).toContain('TestUser');
      done();
    });
  }, 10000); // Increase timeout to 10s

  test('should handle sendMessage event', (done) => {
    clientSocket.emit('joinRoom', { roomId: 'test-room', user: 'TestUser' });
    clientSocket.emit('sendMessage', { roomId: 'test-room', user: 'TestUser', text: 'Hello' });
    clientSocket.on('message', (msg: Message) => {
      expect(msg.user).toBe('TestUser');
      expect(msg.text).toBe('Hello');
      expect(msg.timestamp).toBeDefined();
      done();
    });
  }, 10000);

  test('should handle createRoom event', (done) => {
    clientSocket.emit('createRoom', { roomId: 'new-room' });
    clientSocket.on('roomList', (rooms: string[]) => {
      expect(rooms).toContain('new-room');
      done();
    });
  }, 10000);

  test('should handle leaveRoom event', (done) => {
    clientSocket.emit('joinRoom', { roomId: 'test-room', user: 'TestUser' });
    clientSocket.emit('leaveRoom', { roomId: 'test-room', user: 'TestUser' });
    clientSocket.on('userList', (users: string[]) => {
      expect(users).not.toContain('TestUser');
      done();
    });
  }, 10000);

  test('should handle disconnect event', (done) => {
    clientSocket.emit('joinRoom', { roomId: 'test-room', user: 'TestUser' });
    clientSocket.disconnect();
    clientSocket.on('disconnect', () => {
      clientSocket.connect();
      clientSocket.on('roomList', (rooms: string[]) => {
        expect(rooms).not.toContain('test-room');
        done();
      });
    });
  }, 10000);
});