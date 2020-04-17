import mongoose from 'mongoose';
import { mb } from '../types';
//import uuid of some kind to also be used as an index
const Schema = mongoose.Schema;
//not sure if we need to differentiate between logged in user and user the memory is being created for
//value of song is ID which comes from ref
const schema = new Schema({
  user: { type: String, ref: 'user' },
  song: { type: String, ref: 'song' },
  text: { type: String },
  tags: [{ type: String }],
  createdBy: { type: String, ref: 'user' },
});

const Model = mongoose.model<mb.Memory.MemoryDoc & mongoose.Document>('memory', schema);
export { Model };
