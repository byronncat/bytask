import mongoose from 'mongoose';

await (async function connectToMongoDB() {
  await mongoose
    .connect(process.env.MONGODB_HOST || '')
    .then(() => {
      console.log('[Connection]', '- MongoDB connected');
    })
    .catch(() => {
      console.error('[Connection]', '- MongoDB connection failed');
    });
})();
