import { Socket } from 'socket.io';

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (token) {
    socket.handshake.auth.user = socket.handshake.auth.user || 'Anonymous';
    return next();
  }
  next(new Error('Authentication error'));
};