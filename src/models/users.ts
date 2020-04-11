import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const types = ['user', 'family', 'friend', 'caretaker'];

const schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    type: { type: String, required: true, enum: types },
    address: String,
    birthday: { type: Date, required: true },
    createdBy: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

schema.index({ email: 1 }, { unique: true, background: true });

//do we use export default or module.exports?
const Model = mongoose.model('user', schema);

export { Model, types };
