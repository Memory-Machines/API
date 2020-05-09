import { Router } from 'express';

import { Auth } from '../controllers';

const router = Router();

router.post('/register', Auth.registerUser);
router.post('/login', Auth.login);
//get code triggers a get request to spotify
router.get('/spotifyLogin', Auth.spotifyAuthCodeRequest);
//get tokens (this request will be made by the client, which triggers a post request to spotify)
router.post('/spotifyLogin', Auth.spotifyAuthTokenRequest);

export default router;
