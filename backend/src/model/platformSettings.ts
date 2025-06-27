import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformSettings extends Document {
  adminCommissionPercentage: number;
  updatedAt: Date;
}

const platformSettingsSchema = new Schema<IPlatformSettings>({
  adminCommissionPercentage: {
    type: Number,
    required: true,
    default: 10 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PlatformSettings = mongoose.model<IPlatformSettings>('PlatformSettings', platformSettingsSchema);

export default PlatformSettings;
