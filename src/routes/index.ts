import { Router } from 'express';

import { HealthController } from '../controllers';

import UserRouter from './user';
import AuthRouter from './auth';
import OrgRouter from './org';
import FileRouter from './files';

const ApiRouter = Router();

ApiRouter.use('/health-status', HealthController.healthStatus);
ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/users', UserRouter);
ApiRouter.use('/orgs', OrgRouter);
ApiRouter.use('/files', FileRouter);

export default ApiRouter;
