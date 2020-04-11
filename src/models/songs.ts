import mongoose from 'mongoose';
//do I need to import Users Model?
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  user: { type: String, ref: 'user' },
  year: { type: Number, required: true },
  spotifyLink: { type: String, required: true },
  youTubeLink: { type: String },
  favorite: Boolean,
});
schema.index({ SpoitfyLink: 1 }, { unique: true, background: true });

const Model = mongoose.model('song', schema);
export { Model };
