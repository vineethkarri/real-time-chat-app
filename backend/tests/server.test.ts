import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';

// If using Jest, ensure the following import is present for type support (optional):
// import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

describe('Chat Server', () => {
  let io: Server, server: any, clientSocket: any;

  beforeAll((done) => {
    server = createServer();
    io = new Server(server);
    server.listen(() => {
      clientSocket = Client(`http://localhost:${(server.address() as any).port}`, { auth: { token: 'fake-token' } });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    server.close();
    clientSocket.close();
  });

  test('should broadcast message to room', (done) => {
    clientSocket.emit('joinRoom', { roomId: 'test', user: 'testUser' });
    clientSocket.emit('sendMessage', { roomId: 'test', user: 'testUser', text: 'Hello' });
    clientSocket.on('message', (msg: any) => {
      expect(msg.text).toBe('Hello');
      done();
    });
  });
});