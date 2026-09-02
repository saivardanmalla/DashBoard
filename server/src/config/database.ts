import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const connectDatabase = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus_collab';
    
    // Fallback to in-memory database if connecting to localhost
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('[Database] Using in-memory MongoDB for local development...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    await mongoose.connect(uri);
    console.log('[Database] MongoDB Connected Successfully');
  } catch (error) {
    console.error('[Database] Connection Error:', error);
    process.exit(1);
  }
};
