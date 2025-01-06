import mongoose from 'mongoose';
import { TaskSchema, UserSchema, TimeSessionSchema } from './schema';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    converted.id = converted._id;
    delete converted._id;
    delete converted.__v;
    return converted;
  },
});

export const UserModel =
  mongoose.models.user || mongoose.model('user', UserSchema);
export const TaskModel =
  mongoose.models.task || mongoose.model('task', TaskSchema);
export const TimeSessionModel =
  mongoose.models.time || mongoose.model('time', TimeSessionSchema);
