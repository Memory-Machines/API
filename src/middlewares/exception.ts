import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import { HTTPException } from '../exceptions';
import { Logger } from '../util';
import { MongoError } from 'mongodb';

function handleException(
  error: HTTPException & MongoError & mongoose.Error.ValidationError & Error & any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  Logger.error('Exception Caught >>> ', error);

  // Handling DB errors from MongoDB
  if (error.code === 11000 || error.code === 11001) {
    const [key, value] = Object.entries(error.keyValue).reduce(
      (acc, val) => {
        acc[0] = val[0];
        acc[1] = val[1];
        return acc;
      },
      ['', '']
    );
    return res.status(409).json({ status: 409, message: `${key} "${value}" already exists` });
  }

  // Handling Validation Errors From Mongoose
  if (error.errors) {
    const mongooseError: any = {};
    const keys = Object.keys(error.errors);
    keys.forEach(key => {
      let errMessage = error.errors[key].message;
      if (error.errors[key].properties && error.errors[key].properties.message) {
        errMessage = error.errors[key].properties.message.replace('`{PATH}`', key);
      }
      errMessage = errMessage
        .replace('Path ', '')
        .replace(key, '')
        .trim();
      mongooseError[key] = errMessage;
    });
    return res.status(409).json({ type: 'validation_error', errors: mongooseError });
  }
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).send({
    message,
    status,
  });
}

export default handleException;
