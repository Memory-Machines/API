import { Container } from 'typedi';
import _ from 'lodash';

import { OrgService } from '../services';
import { Logger } from '../util';
import { NextFunction, Request, Response } from 'express';
import { IUserPopulated, IUserTeamPopulated } from '../models';

const orgService = Container.get(OrgService);

/**
 *
 * @param allowedScopes will be empty if this is used on a non org routes
 *
 */
export const authorizeUser = (allowedScopes: string[] = []) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Getting user from Request
    const user: IUserPopulated = req.user;
    // Checking the OrgID
    const { orgId } = req.params || req.body || req.query;

    if (!orgId) {
      return next(new Error('Org Id missing from route'));
    }
    // Checking if the org Exists
    const org = await orgService.loadOrg(orgId, true);
    if (!org) {
      return next(new Error('Org not found'));
    }
    req.org = org;
    // Checking if user is part of that org
    const userAcl: IUserTeamPopulated = user.teams.find((team: IUserTeamPopulated) => team.org._id === org._id);
    if (!userAcl) {
      return next(new Error('User is not a part of this org'));
    }
    return next();
  } catch (e) {
    Logger.error('Authorize User Middleware');
    next(e);
  }
};
