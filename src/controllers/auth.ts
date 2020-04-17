import { Request, Response, NextFunction } from 'express';

import { Auth } from '../services';
//import { getMaxListeners } from 'cluster';

async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, memberType, address, birthday, createdBy, email, password } = req.body;

    const user = await Auth.registerUser({
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
    console.error('AuthController::registerUser', e);
    res.status(500).send(e.message);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await Auth.login({
      email,
      password,
    });
    res.send(user); //sending plain user object
  } catch (e) {
    console.error('AuthController::login', e);
    res.status(500).send(e.message);
  }
}

export { registerUser, login };
