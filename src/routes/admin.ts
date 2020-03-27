import { Router } from 'express';

import { AdminController } from '../controllers';
import { authenticateAdmin, authorizeAdmin } from '../middlewares';

const router = Router();

router
  .route('/orgs')
  .get(authenticateAdmin(), AdminController.listOrgs)
  .post(authenticateAdmin(), authorizeAdmin(['superAdmin']), AdminController.createAccount);

router
  .route('/admins/:adminId/deactivate')
  .post(authenticateAdmin(), authorizeAdmin(['superAdmin']), AdminController.deactivateAdmin);

router
  .route('/admins/:adminId/activate')
  .post(authenticateAdmin(), authorizeAdmin(['superAdmin']), AdminController.activateAdmin);

router
  .route('/admins')
  .get(authenticateAdmin(), AdminController.listAdmins)
  .post(authenticateAdmin(), authorizeAdmin(['superAdmin']), AdminController.createAdmin);

router.route('/password-link').post(AdminController.requestPasswordReset);

router.route('/reset-password').post(AdminController.resetPassword);

router.route('/login').post(AdminController.loginAdmin);

export default router;
