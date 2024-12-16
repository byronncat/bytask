import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import type { Document } from 'mongoose';
import type { IUser } from 'schema';

interface UserDocument extends IUser, Document {
  id: IUser['id'];
  _doc?: IUser;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  _id: { type: String, required: true, default: uuidv4 },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profile_photo: {
    url: { type: String },
    orientation: { type: String },
  },
});

export { UserSchema };
