import mongoose from 'mongoose';

let isConnected = false;

async function connectToMongoDB() {
  if (isConnected) {
    console.log('[Connection]', '- MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_HOST || '');
    isConnected = true;
    console.log('[Connection]', '- MongoDB connected');
  } catch (error) {
    console.error('[Connection]', '- MongoDB connection failed', error);
  }
}

connectToMongoDB();

export default connectToMongoDB;
