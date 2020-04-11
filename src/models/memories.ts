import mongoose from 'mongoose';
//import uuid of some kind to also be used as an index
const Schema = mongoose.Schema;
//not sure if we need to differentiate between logged in user and user the memory is being created for
//value of song is ID which comes from ref
const schema = new Schema({
  user: { type: String, ref: 'user' },
  song: { type: String, ref: 'song' },
  text: { type: String },
  tags: [{ type: Schema.Types.Mixed }],
  createdBy: { type: String, ref: 'user' },
});

const Model = mongoose.model('memory', schema);
export { Model };
