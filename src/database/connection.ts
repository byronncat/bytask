import mongoose from 'mongoose';
import { createClient } from 'redis';
import 'colors';

const redis = createClient({
  password: process.env.REDIS_PASSWORD || '',
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

async function connectToRedis() {
  // Redis connection event listeners
  redis.on('ready', () => {
    console.log('[Connection]'.green, '- Redis connected');
  });
  redis.on('error', () => {
    console.error('[Connection]'.red, '- Redis connection failed');
  });

  await redis.connect(); // Call after add event listeners
}

async function connectToMongoDB() {
  await mongoose
    .connect(process.env.MONGODB_HOST || '')
    .then(() => {
      console.log('[Connection]'.green, '- MongoDB connected');
    })
    .catch(() => {
      console.error('[Connection]'.red, '- MongoDB connection failed');
    });
}

(async function initializeConnections() {
  await connectToRedis();
  await connectToMongoDB();
})();

export { redis };
