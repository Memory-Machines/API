import { Container } from 'typedi';
import passport from 'passport';
import passportJwt, { StrategyOptions } from 'passport-jwt';

import { AdminService } from '../services';
import { Logger, CONSTANTS } from '../util';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: CONSTANTS.config.server.jwtSecret,
};

const adminService = Container.get(AdminService);

passport.use(
  'admin-jwt',
  new JwtStrategy(opts, async function adminJwtCallback(jwtPayload, done) {
    try {
      const admin = await adminService.loadAdmin(jwtPayload.data._id);
      if (admin) {
        if (!admin.active) {
          return done('Admin not Active', false);
        }
        delete admin.password;
        return done(undefined, admin);
      } else {
        return done(Error('Admin not found'), false);
      }
    } catch (e) {
      Logger.error('Authenticate Admin Middleware');
      return done(e, false);
    }
  })
);

// This will add req.admin field to req
export const authenticateAdmin = () =>
  passport.authenticate('admin-jwt', { session: false, assignProperty: 'admin', authInfo: false });
