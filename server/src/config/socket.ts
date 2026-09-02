import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const setupSocketIO = (io: Server) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret') as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    socket.join(`user:${userId}`);

    socket.on('join:project', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leave:project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('join:channel', ({ channelId }) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on('chat:typing', ({ channelId, userName, isTyping }) => {
      socket.to(`channel:${channelId}`).emit('chat:typing', { userId, userName, isTyping });
    });

    socket.on('task:update', ({ projectId, taskId, status }) => {
      socket.to(`project:${projectId}`).emit('task:updated', { taskId, status, updatedBy: userId });
    });
  });
};
