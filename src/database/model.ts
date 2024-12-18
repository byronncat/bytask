import mongoose from 'mongoose';
import { MissionSchema, UserSchema } from './schema';

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    converted.id = converted._id;
    delete converted._id;
    delete converted.__v;
    return converted;
  },
});

function getModel(modelName: string, schema: mongoose.Schema) {
  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }
  return mongoose.model(modelName, schema);
}

// export const UserModel =
//   mongoose.models.user || mongoose.model('user', UserSchema);
// export const MissionModel =
//   mongoose.models.mission || mongoose.model('mission', MissionSchema);

export const UserModel = getModel('user', UserSchema);
export const MissionModel = getModel('mission', MissionSchema);
