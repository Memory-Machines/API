import { User } from '../models';
import { mb } from '../types';

async function saveNewUserToDb(user: mb.User): Promise<mb.User.UserDoc> {
  try {
    const newUser = new User.Model(user);
    await newUser.save();
    return newUser.toObject();
  } catch (e) {
    console.error('userRepository::saveNewUserToDb', e);
    throw e;
  }
}

async function findUserWithEmail(email: string): Promise<mb.User.UserDoc> {
  try {
    const result = await User.Model.findOne({ email }).lean().exec();
    return result;
  } catch (e) {
    console.error('userRepository::findUserWithEmail', e);
    throw e;
  }
}

export { saveNewUserToDb, findUserWithEmail };
