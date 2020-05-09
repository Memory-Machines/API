import { Router } from 'express';

import { Memory } from '../controllers';

const router = Router();

router.post('/', Memory.appendMemory);

export default router;
