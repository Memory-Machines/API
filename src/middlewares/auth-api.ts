import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import passportHttpBearer from 'passport-http-bearer';

import { OrgService } from '../services';
import { Logger } from '../util';

const BearerStrategy = passportHttpBearer.Strategy;
const orgService = Container.get(OrgService);

passport.use(
  new BearerStrategy(async (secret, done) => {
    try {
      const org = await orgService.findOrg({ 'api.secret': secret }, '+api', false, true);
      if (org) {
        if (!org.active) {
          return done(new Error('Inactive organization'), null);
        }
        if (!org.api.active) {
          return done(new Error('Api is not active for this organization'), null);
        }
        return done(undefined, org);
      } else {
        return done(new Error('Invalid API Secret'), false);
      }
    } catch (e) {
      Logger.error('Authenticate API Middleware');
      return done(e, false);
    }
  })
);

// This will add req.org field to req
export const authenticateApi = () => (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('bearer', { session: false }, (err, org, info) => {
    if (err) {
      return next(err);
    }
    if (!org) {
      return next(new Error('Invalid API Secret'));
    }
    req.org = org;
    return next();
  })(req, res, next);
};
