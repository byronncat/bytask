import mongoose from 'mongoose';
import { UserSchema } from './schema';

// Check if the value is a string
mongoose.Schema.Types.String.checkRequired((v) => typeof v === 'string');

export const UserModel =
  mongoose.models.user || mongoose.model('user', UserSchema);
