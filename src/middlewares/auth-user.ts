import { Container } from 'typedi';
import passport from 'passport';
import passportJwt, { StrategyOptions } from 'passport-jwt';

import { UserService } from '../services';
import { Logger, CONSTANTS } from '../util';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: CONSTANTS.config.server.jwtSecret,
};

const userService = Container.get(UserService);

// This will add req.user field to req
passport.use(
  'user-jwt',
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // todo add cache here
      const user = await userService.loadUserWithOrgDetails(jwtPayload.data._id);
      if (user) {
        delete user.password;
        done(undefined, user);
      } else {
        done(Error('User not found'), false);
      }
    } catch (e) {
      Logger.error('Authenticate USER Middleware');
      done(e, false);
    }
  })
);

// This will add req.user field to req
export const authenticateUser = () => passport.authenticate('user-jwt', { session: false });
