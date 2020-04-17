import { Router } from 'express';

import { Auth } from '../controllers';

const router = Router();

router.post('/register', Auth.registerUser);
router.post('/login', Auth.login);

export default router;
