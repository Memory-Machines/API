import { Router } from 'express';

import { OrgController } from '../controllers';
import { authenticateUser, authorizeUser } from '../middlewares';

const OrgRouter = Router();

OrgRouter.route('/:orgId/api/key')
  .get(authenticateUser(), authorizeUser(), OrgController.getApiSecret)
  .put(authenticateUser(), authorizeUser(), OrgController.generateApiSecret);

OrgRouter.route('/:orgId/api').get(authenticateUser(), authorizeUser(), OrgController.getApi);

OrgRouter.route('/:orgId').get(authenticateUser(), authorizeUser(), OrgController.getOrg);

OrgRouter.route('/').post(authenticateUser(), OrgController.createOrg);

export default OrgRouter;
