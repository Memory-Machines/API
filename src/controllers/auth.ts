import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

import { UserService, AuthService } from '../services';
import { Logger } from '../util';

const userService = Container.get(UserService);
const authService = Container.get(AuthService);

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await userService.registerUser(req.body);
    res.json(resp);
  } catch (e) {
    Logger.error('AuthController::registerUser');
    next(e);
  }
}

export async function registerUserWithOrg(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgName, ...user } = req.body;
    const resp = await userService.registerUserWithOrg(user, { name: orgName });
    res.json(resp);
  } catch (e) {
    Logger.error('AuthController::registerUserWithOrg');
    next(e);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await userService.login(req.body.email, req.body.password);
    res.send(resp);
  } catch (e) {
    Logger.error('AuthController::loginUser');
    next(e);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      next(new Error('Unauthorzed'));
    }
  } catch (e) {
    Logger.error('AuthController::me');
    next(e);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.send({ message: 'ok' });
  } catch (e) {
    Logger.error('AuthController::requestPasswordReset');
    next(e);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const { token, password } = req.body;
  try {
    await authService.resetPassword(token, password);
    res.send({ message: 'ok' });
  } catch (e) {
    Logger.error('AuthController::resetPassword');
    next(e);
  }
}
