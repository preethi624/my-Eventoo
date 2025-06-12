import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  otp?: string;
  otpExpiry?: Date;
  isBlocked: boolean;
  authMethod?:string;
  phone?:number;
  location?:string;
  aboutMe?:string;
  profileImage:string
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String,required: function () {
    return this.authMethod !== 'google';
  } },
  role: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  isBlocked: { type: Boolean, default: false },
  phone:{type:Number},
  location:{type:String},
  aboutMe:{type:String},
  profileImage:{type:String}
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
