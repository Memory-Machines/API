import { Router } from 'express';

import { Song } from '../controllers';

const router = Router();

router.get('/', Song.storeSong);

export default router;
