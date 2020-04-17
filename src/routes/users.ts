import { Router } from 'express';

import { User } from '../controllers';

const router = Router();

router.post('/', User.createUser);

export default router;
