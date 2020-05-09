import { Request, Response, NextFunction } from 'express';
import querystring from 'querystring';

import { Auth } from '../services';
import { spotify_cred } from '../utils/credentials';
import { generateRandomString } from '../utils/spotifyToken';

async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, memberType, address, birthday, createdBy, email, password } = req.body;

    const user = await Auth.registerUser({
      firstName,
      lastName,
      memberType,
      address,
      birthday,
      createdBy,
      email,
      password,
    });
    res.send(user); //sending plain user object
  } catch (e) {
    console.error('AuthController::registerUser', e);
    res.status(500).send(e.message);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await Auth.login({
      email,
      password,
    });
    //generate cookie
    const state = generateRandomString(16);
    res.cookie(spotify_cred.stateKey, state);

    // your application requests authorization
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: spotify_cred.client_id,
          scope: spotify_cred.scope,
          redirect_uri: spotify_cred.redirect_uri,
          state: state,
        })
    );
    //Can I also res.send after redirecting? Do I even need to? Why am I sending this user object back anyways?
    res.send(user); //sending plain user object
  } catch (e) {
    console.error('AuthController::login', e);
    res.status(500).send(e.message);
  }
}

async function spotifyAuthCodeRequest(req: Request, res: Response, next: NextFunction) {
  try {
    //here we are making a call to spotify/authorize...
    const spotifyAuth = await Auth.spotifyAuthCodeRequest();
    //how do I know if the user is actually given the url with the code? How do I test that in postman?
    res.send(spotifyAuth.data);
  } catch (e) {
    console.error('AuthController::spotifyAuthCodeRequest', e);
    res.status(500).send(e.message);
  }
}

async function spotifyAuthTokenRequest(req: Request, res: Response, next: NextFunction) {
  const { code } = req.query;
  console.log({ code });
  //do something to make call to https://accounts.spotify.com/api/token

  try {
    const token = await Auth.spotifyAuthTokenRequest(code);
    res.send(token);
  } catch (e) {
    console.error('AuthController::spotifyAuthTokenRequest', e);
    res.status(500).send(e.message);
  }
}

export { registerUser, login, spotifyAuthCodeRequest, spotifyAuthTokenRequest };
