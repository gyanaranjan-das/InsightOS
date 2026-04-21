import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';

let io: SocketServer | null = null;

export function setupSocketServer(httpServer: HTTPServer): void {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      socket.data.orgId = payload.orgId;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const orgId = socket.data.orgId;
    socket.join(`org:${orgId}`);
    console.log(`🔌 Socket connected: user ${socket.data.userId} → org:${orgId}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: user ${socket.data.userId}`);
    });
  });

  console.log('✅ Socket.io server initialized');
}

export function getIO(): SocketServer | null {
  return io;
}
