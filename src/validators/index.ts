import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import * as UserValidator from './user';

export { UserValidator };

export const handleValidation = (validations: any[]) => {
  return async function validation(req: Request, res: Response, next: NextFunction) {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).send({ type: 'validation_error', errors: errors.array() });
  };
};
