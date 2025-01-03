import type { Document } from 'mongoose';
import type { Task, User } from 'schema';

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TASK_STATUS } from '@/constants/metadata';

interface UserDocument extends User, Document {
  id: User['id'];
  _doc?: User;
}

const UserSchema = new mongoose.Schema<UserDocument>({
  _id: { type: String, required: true, default: uuidv4 },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String },
  verified: { type: Boolean, required: true, default: false },
  type: { type: Number, required: true },
});

// interface LabelDocument extends Label, Document {
//   id: Label['id'];
//   _doc?: Label;
// }

// const LabelSchema = new mongoose.Schema<LabelDocument>({
//   name: { type: String },
//   color: { type: String, required: true },
// });

// interface WorkspaceDocument extends Workspace, Document {
//   id: Workspace['id'];
//   labels: Types.DocumentArray<LabelDocument>;
//   _doc?: Workspace;
// }

// const WorkspaceSchema = new mongoose.Schema<WorkspaceDocument>({
//   labels: {
//     type: [LabelSchema],
//     required: true,
//     default: () => [
//       { color: '#216E4E' },
//       { color: '#E2B203' },
//       { color: '#AE2E24' },
//       { color: '#0055CC' },
//     ],
//   },
// });

interface TaskDocument extends Task, Document {
  id: Task['id'];
  _doc?: Task;
}

const TaskSchema = new mongoose.Schema<TaskDocument>({
  title: { type: String, required: true },
  uid: { type: String, required: true, ref: 'user' },
  description: { type: String },
  cover: { type: String },
  status: { type: Number, required: true, default: TASK_STATUS.TODO },
  start_date: { type: Date },
  due_date: { type: Date },
  recently_updated: { type: Date, required: true, default: Date.now },
  created_at: { type: Date, required: true, default: Date.now },
  // labels: [{ type: String, ref: 'label' }],
  // checklists: [
  //   {
  //     title: { type: String, required: true },
  //     items: [
  //       {
  //         title: { type: String, required: true },
  //         checked: { type: Boolean, required: true, default: false },
  //       },
  //     ],
  //   },
  // ],
});

export {
  UserSchema,
  TaskSchema,
  // WorkspaceSchema
};
