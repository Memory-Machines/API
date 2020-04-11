import { User } from '../repositories';

interface User {
  firstName: string;
  lastName: string;
  type: 'user' | 'family' | 'friend' | 'caretaker';
  address: string;
  birthday: string;
  createdBy: string;
  email: string;
  password: string;
}

async function createUser(data: User) {
  //validation
  //structure it
  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    type: data.type,
    address: data.address,
    birthday: data.birthday,
    createdBy: data.createdBy,
    email: data.email,
    password: data.password,
  };
  const result = await User.saveNewUserToDb(user);
  return result; // return Promise.resolve(resut), value is a plain object
}

export { createUser };
