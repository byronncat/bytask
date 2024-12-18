import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import type { Document, Types } from 'mongoose';
import type { ILabel, IMission, IUser } from 'schema';
import { STATUS } from '@/constants/convention';

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

interface LabelDocument extends ILabel, Document {
  id: ILabel['id'];
  _doc?: ILabel;
}

const LabelSchema = new mongoose.Schema<LabelDocument>({
  name: { type: String },
  color: { type: String, required: true },
});

interface MissionDocument extends IMission, Document {
  id: IMission['id'];
  labels: Types.DocumentArray<LabelDocument>;
  _doc?: IMission;
}

const MissionSchema = new mongoose.Schema<MissionDocument>({
  title: { type: String, required: true },
  user_id: { type: String, required: true, ref: 'user' },
  labels: {
    type: [LabelSchema],
    required: true,
    default: () => [
      { color: '#216E4E' },
      { color: '#E2B203' },
      { color: '#AE2E24' },
      { color: '#0055CC' },
    ],
  },
  description: { type: String },
  status: { type: Number, required: true, default: STATUS.TODO },
  actived_at: { type: Date, required: true, default: Date.now },
  created_at: { type: Date, required: true, default: Date.now },
});

export { UserSchema, MissionSchema };
