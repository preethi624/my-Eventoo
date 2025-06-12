import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import Admin from '../model/admin'; 


const MONGODB_URI = 'mongodb://127.0.0.1:27017/eventDB';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function createAdmin(): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminData = {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    };

    const admin = await Admin.create(adminData);
    console.log('Admin created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
