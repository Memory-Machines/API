import _ from 'lodash';

import { Logger } from '../util';
import { NextFunction, Request, Response } from 'express';
import { IOrgDoc } from '../models';

/**
 *
 * @param allowedScopes will be empty if this is used on a non org routes
 *
 */
export const authorizeApi = (allowedScopes: string[] = []) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const org: IOrgDoc = req.org;
    // no permission required for this route. pass
    if (allowedScopes.length === 0) {
      return next();
    }
    // convert * permissions to actual permissions that it covers
    const apiScopes = org.api.scopes;
    // checking if there is atleast one common permission value between both
    const match = _.intersection(apiScopes, allowedScopes);
    // if the match array contains atleast one common permission then it's a pass
    const apiIsAllowed = match && match.length > 0;
    if (apiIsAllowed) {
      return next();
    } else {
      return next(new Error('Api does not have the sufficient permission to perform this action'));
    }
  } catch (e) {
    Logger.error('Authorize API Middleware');
    next(e);
  }
};
