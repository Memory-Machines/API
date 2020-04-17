import bcrypt from 'bcrypt';

import { User } from '../services';
import { mb } from '../types';

const saltRounds = 10;

async function registerUser(data: mb.User): Promise<mb.User.UserDoc> {
  try {
    const passwordHash = await bcrypt.hash(data.password, saltRounds);
    const user: mb.User = {
      firstName: data.firstName,
      lastName: data.lastName,
      memberType: data.memberType,
      address: data.address,
      birthday: data.birthday,
      createdBy: data.createdBy,
      email: data.email,
      password: passwordHash,
    };
    const result = await User.createUser(user);
    delete result.password;
    return result;
  } catch (e) {
    console.error('authService::registerUSer', e);
    throw e;
  }
}

async function login(data: { email: string; password: string }) {
  try {
    //1. get from our collection, whether or not that email exists
    //2. make sure password in that document matches correctly
    //3. if it does, then log them in
    //4. if not throw error
    //In order to query a specific entity, we must go through that entity's specific service which is importing its repository which is importing its mongoose model
    const result = await User.findUserWithEmail(data.email);
    const isAMatch = await bcrypt.compare(data.password, result.password);
    if (isAMatch) {
      //actually return cookie/session info
      delete result.password;
      return result;
    }
    throw new Error('invalid email or password');
  } catch (e) {
    console.error('authService::login', e);
    throw e;
  }
}

export { registerUser, login };
