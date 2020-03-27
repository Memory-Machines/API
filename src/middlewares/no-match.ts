import { NextFunction, Request, Response } from 'express';

import { HTTPException } from '../exceptions';

function handleNotRouteMatch(request: Request, response: Response, next: NextFunction) {
  next(new HTTPException(404, 'Not Found'));
}

export default handleNotRouteMatch;
