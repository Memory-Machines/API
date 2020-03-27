import { Logger } from '../util';
import { NextFunction, Request, Response } from 'express';
import { IAdmin, adminRoles } from '../models';

export const authorizeAdmin = (allowedTypes: adminRoles[] = []) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Getting user from Request
    let pass = false;
    const admin: IAdmin = req.admin;
    const isEmpty = allowedTypes.length <= 0;
    const roleIsAllowed = allowedTypes.includes(admin.role);

    if (isEmpty) {
      pass = true;
    }

    if (!isEmpty && roleIsAllowed) {
      pass = true;
    }

    if (!isEmpty && !roleIsAllowed) {
      pass = false;
    }

    if (pass) {
      return next();
    } else {
      return next(new Error('Admin is not allowed to perform this action'));
    }
  } catch (e) {
    Logger.error('Authorize Admin Middleware');
    next(e);
  }
};
