import { Router } from 'express';

import { AuthController } from '../controllers';
import { UserValidator, handleValidation } from '../validators';
import { authenticateUser } from '../middlewares';

const router = Router();

router.route('/password-link').post(AuthController.requestPasswordReset);

router.route('/reset-password').post(AuthController.resetPassword);

router.route('/me').get(authenticateUser(), AuthController.me);

router.route('/login').post(handleValidation(UserValidator.loginUser), AuthController.loginUser);

router.route('/register').post(handleValidation(UserValidator.createUser), AuthController.registerUser);

router
  .route('/register/org')
  .post(handleValidation(UserValidator.createUserWithOrg), AuthController.registerUserWithOrg);

export default router;
