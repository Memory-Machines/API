import { Request, Response, NextFunction } from 'express';

import { Auth } from '../services';

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session.email) {
      return res.send({ message: 'Welcome Home', user: req.session.user });
    }
    const { code } = req.query;
    const token = await Auth.spotifyAuthTokenRequest(code);
    const user = await Auth.getUserEmail(token.access_token);
    // check user in the database here
    const sess = req.session;
    sess.email = user.email;
    sess.tokenData = token;
    sess.user = user;
    res.send({ message: 'ok' });
  } catch (e) {
    console.error('AuthController::login', e);
    res.status(500).send(e.message);
  }
}

async function authenticatedRoute(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session.email) {
      // user is authenticated
      return res.send({ message: 'Welcome Home', user: req.session.user });
    } else {
      return res.status(401).send({ message: 'Go Back' });
    }
  } catch (e) {
    console.error('AuthController::authenticatedRoute', e);
    res.status(500).send(e.message);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  } catch (e) {
    console.error('AuthController::logout', e);
    res.status(500).send(e.message);
  }
}

async function loginLink(req: Request, res: Response, next: NextFunction) {
  try {
    const my_client_id = '54bb3d7498da476987b8463ca50ff4df';
    const redirect_uri = 'http://localhost:3000/redirect/login/spotify';
    const scopes = 'streaming user-read-private user-read-email';
    console.log(req.sessionID);
    res.send(
      'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        my_client_id +
        '&scope=' +
        encodeURIComponent(scopes) +
        '&redirect_uri=' +
        encodeURIComponent(redirect_uri)
    );
  } catch (e) {
    console.error('AuthController::loginLink', e);
    res.status(500).send(e.message);
  }
}

export { login, logout, authenticatedRoute, loginLink };
