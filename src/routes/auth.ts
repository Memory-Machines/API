import { Router } from 'express';

import { Auth } from '../controllers';

const router = Router();

router.post('/login', Auth.login);

router.get('/login-link', Auth.loginLink);

router.get('/logout', Auth.logout);

router.get('/secure-route', Auth.authenticatedRoute);

export default router;
