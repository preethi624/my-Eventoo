import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventDB';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
<<<<<<< HEAD
  } catch (error) {
    if (error instanceof Error) {
    console.error('MongoDB connection error:', error.message);
  } else {
    console.error('MongoDB connection error:', error);
  }
=======
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
    process.exit(1);
  }
};

export default connectDB;
