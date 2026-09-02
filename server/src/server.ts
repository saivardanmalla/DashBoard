import http from 'http';
import dotenv from 'dotenv';
import { app } from './app';
import { connectDatabase } from './config/database';
import { Server } from 'socket.io';
import { setupSocketIO } from './config/socket';
import { seedDatabase } from './seed';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

setupSocketIO(io);

connectDatabase().then(async () => {
  await seedDatabase();
  server.listen(PORT, () => {
    console.log(`[Server] SYNORA running on port ${PORT}`);
  });
});

