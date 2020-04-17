import mongoose from 'mongoose';
import { mb } from '../types';

const Schema = mongoose.Schema;

const types: mb.User.memberType[] = ['user', 'family', 'friend', 'caretaker'];

const schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    memberType: { type: String, required: true, enum: types },
    address: String,
    birthday: { type: Date, required: true },
    createdBy: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

//background: if not true, MDB will start to build index and spend its resources building it and stop responding to queries. consier FB building index for millions of users (could take 2-3 days). Build this inex, only when you are idle.
schema.index({ email: 1 }, { unique: true, background: true });

const Model = mongoose.model<mb.User.UserDoc & mongoose.Document>('user', schema);

export { Model, types };
