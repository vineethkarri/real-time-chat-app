import { Socket } from 'socket.io';

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token; // Firebase ID token
  if (token) {
    // In production: Verify token with Firebase Admin SDK
    // For demo: Assume valid if present
    return next();
  }
  next(new Error('Authentication error'));
};