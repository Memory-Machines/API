import { User } from '../models';

async function saveNewUserToDb(user: any) {
  const newUser = new User.Model(user);
  await newUser.save();
  return newUser.toObject;
}

export { saveNewUserToDb };
