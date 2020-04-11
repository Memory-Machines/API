import { Router } from 'express';

import { Memory } from '../controllers';

const router = Router();

router.get('/', Memory.appendMemory);

export default router;
