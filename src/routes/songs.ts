import { Router } from 'express';

import { Song } from '../controllers';

const router = Router();

router.post('/', Song.storeSong);

export default router;
