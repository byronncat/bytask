import mongoose from 'mongoose';
import 'colors';

await (async function connectToMongoDB() {
  await mongoose
    .connect(process.env.MONGODB_HOST || '')
    .then(() => {
      console.log('[Connection]'.green, '- MongoDB connected');
    })
    .catch(() => {
      console.error('[Connection]'.red, '- MongoDB connection failed');
    });
})();
