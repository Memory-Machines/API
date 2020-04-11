import { Router } from 'express';

import { User } from '../controllers';

const router = Router();

router.get('/', User.createUserController);

export default router;
