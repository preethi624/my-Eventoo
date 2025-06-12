import mongoose, { Document, Schema } from 'mongoose';

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
}

const adminSchema: Schema<IAdmin> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
});

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;
