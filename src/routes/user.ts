import { Router } from 'express';

import { UserController } from '../controllers';
import { handleValidation, UserValidator } from '../validators';
import { authenticateUser } from '../middlewares';

const UserRouter = Router();

UserRouter.route('/account/name').post(
  authenticateUser(),
  handleValidation(UserValidator.updateName),
  UserController.updateName
);

UserRouter.route('/account/email').post(
  authenticateUser(),
  handleValidation(UserValidator.updateEmail),
  UserController.updateEmail
);

UserRouter.route('/account/password').post(
  authenticateUser(),
  handleValidation(UserValidator.updatePassword),
  UserController.updatePassword
);

export default UserRouter;
