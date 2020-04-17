import { Request, Response, NextFunction } from 'express';

import { User } from '../services';

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, memberType, address, birthday, createdBy, email, password } = req.body;

    const user = await User.createUser({
      firstName,
      lastName,
      memberType,
      address,
      birthday,
      createdBy,
      email,
      password,
    });
    res.send(user); //sending plain user object
  } catch (e) {
    console.error('UserController::createUser', e);
    res.status(500).send(e.message);
  }
}

export { createUser };

/* */
