import { ValidationChain, body } from 'express-validator';

export const createUser: ValidationChain[] = [
  body('email', 'Invalid Email')
    .isEmail()
    .withMessage('email is incorrect')
    .exists()
    .withMessage('email cannot be empty')
    .isLength({ min: 3 })
    .withMessage('email must be a string')
    .isString(),
  body('firstName', 'firstName is required')
    .exists()
    .withMessage('firstName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('firstName must be a string'),
  body('lastName', 'lastName is required')
    .exists()
    .withMessage('lastName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('lastName must be a string'),
  body('password', 'Password not valid')
    .exists()
    .withMessage('password cannot be empty')
    .isLength({ min: 7 })
    .withMessage('password must be 7 characters long')
    .isString()
    .withMessage('password must be a string'),
];

export const createUserWithOrg: ValidationChain[] = [
  body('email', 'Invalid Email')
    .isEmail()
    .withMessage('email is incorrect')
    .exists()
    .withMessage('email cannot be empty')
    .isLength({ min: 3 })
    .withMessage('email must be a string')
    .isString(),
  body('orgName', 'Invalid Org Name')
    .exists()
    .withMessage('orgName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('orgName must be a string'),
  body('firstName', 'firstName is required')
    .exists()
    .withMessage('firstName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('firstName must be a string'),
  body('lastName', 'lastName is required')
    .exists()
    .withMessage('lastName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('lastName must be a string'),
  body('password', 'Password not valid')
    .exists()
    .withMessage('password cannot be empty')
    .isLength({ min: 7 })
    .withMessage('password must be 7 characters long')
    .isString()
    .withMessage('password must be a string'),
];

export const loginUser: ValidationChain[] = [
  body('email', 'Email is required')
    .isEmail()
    .withMessage('email is incorrect')
    .exists()
    .withMessage('email cannot be empty')
    .isLength({ min: 3 })
    .withMessage('email must be a string')
    .isString(),
  body('password', 'Password is required')
    .exists()
    .withMessage('password cannot be empty')
    .isLength({ min: 7 })
    .withMessage('password must be 7 characters long')
    .isString()
    .withMessage('password must be a string'),
];

export const updateName: ValidationChain[] = [
  body('firstName', 'firstName is required')
    .exists()
    .withMessage('firstName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('firstName must be a string'),
  body('lastName', 'lastName is required')
    .exists()
    .withMessage('lastName cannot be empty')
    .isLength({ min: 1 })
    .isString()
    .withMessage('lastName must be a string'),
];

export const updateEmail: ValidationChain[] = [
  body('email', 'Invalid Email')
    .isEmail()
    .withMessage('email is incorrect')
    .exists()
    .withMessage('email cannot be empty')
    .isLength({ min: 3 })
    .withMessage('email must be a string')
    .isString(),
];

export const updatePassword: ValidationChain[] = [
  body('oldPassword', 'Password not valid')
    .exists()
    .withMessage('password cannot be empty')
    .isString()
    .withMessage('password must be a string'),
  body('newPassword', 'Password not valid')
    .exists()
    .withMessage('password cannot be empty')
    .isLength({ min: 7 })
    .withMessage('password must be 7 characters long')
    .isString()
    .withMessage('password must be a string'),
];
