import { User } from '../repositories';
import { mb } from '../types';

async function createUser(data: mb.User): Promise<mb.User.UserDoc> {
  try {
    const result = await User.saveNewUserToDb(data);
    return result; // return Promise.resolve(resut), value is a plain object
  } catch (e) {
    console.error('userService::createUser', e);
    throw e;
  }
}

async function findUserWithEmail(email: string) {
  try {
    const result = await User.findUserWithEmail(email);
    return result;
  } catch (e) {
    console.error('userService::findUserWithEmail', e);
    throw e;
  }
}

export { createUser, findUserWithEmail };
