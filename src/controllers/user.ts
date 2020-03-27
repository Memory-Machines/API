import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../services';
import { Logger } from '../util';

const userService = Container.get(UserService);

export async function updateName(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await userService.updateName(req.user._id, req.body);
    res.send(resp);
  } catch (e) {
    Logger.error('UserController::updateName');
    next(e);
  }
}

export async function updateEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await userService.updateEmail(req.user._id, req.body.email);
    res.send(resp);
  } catch (e) {
    Logger.error('UserController::updateEmail');
    next(e);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await userService.updatePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
    res.send(resp);
  } catch (e) {
    Logger.error('UserController::updatePassword');
    next(e);
  }
}
