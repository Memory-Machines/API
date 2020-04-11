import { Router } from 'express';

import user from './users';
import song from './songs';
import memory from './memories';

const router = Router();

router.use('/users', user);
router.use('/songs', song);
router.use('/memories', memory);

export default router;
