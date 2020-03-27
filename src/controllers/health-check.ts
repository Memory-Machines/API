import { Request, Response, NextFunction } from 'express';

import { Logger, CONSTANTS } from '../util';

export async function healthStatus(req: Request, res: Response, next: NextFunction) {
  try {
    res.send({
      context: CONSTANTS.config.server.context,
      environment: CONSTANTS.config.server.env,
      status: 'HEALTHY',
    });
  } catch (e) {
    Logger.error('HealthCheckController::healthStatus');
    next(e);
  }
}
