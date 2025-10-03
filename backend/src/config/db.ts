import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    if (error instanceof Error) {
    console.error('MongoDB connection error:', error.message);
  } else {
    console.error('MongoDB connection error:', error);
  }
    process.exit(1);
  }
};

export default connectDB;
