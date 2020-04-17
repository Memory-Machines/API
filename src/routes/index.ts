import { Router } from 'express';

import user from './users';
import song from './songs';
import memory from './memories';
import auth from './auth';

const router = Router();

router.use('/users', user);
router.use('/songs', song);
router.use('/memories', memory);
router.use('/auth', auth);

export default router;
