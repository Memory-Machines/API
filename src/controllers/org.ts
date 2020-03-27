import { Container } from 'typedi';

import { Request, Response, NextFunction } from 'express';

import { OrgService, UserService } from '../services';
import { Logger } from '../util';

const orgService = Container.get(OrgService);
const userService = Container.get(UserService);

export async function getOrg(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await orgService.findOrg({ _id: req.params.orgId });
    res.send(org);
  } catch (e) {
    Logger.error('OrgController::getOrg');
    next(e);
  }
}

export async function createOrg(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await userService.createOrg(req.body, req.user);
    res.send(org);
  } catch (e) {
    Logger.error('OrgController::createOrg');
    next(e);
  }
}

export async function getApiSecret(req: Request, res: Response, next: NextFunction) {
  try {
    const secret = await orgService.getApiSecret(req.params.orgId);
    res.json(secret);
  } catch (e) {
    Logger.error('OrgController::getApiSecret');
    next(e);
  }
}

export async function generateApiSecret(req: Request, res: Response, next: NextFunction) {
  try {
    const secret = await orgService.generateApiSecret(req.params.orgId);
    res.json(secret);
  } catch (e) {
    Logger.error('OrgController::generateApiKey');
    next(e);
  }
}

export async function getApi(req: Request, res: Response, next: NextFunction) {
  try {
    const api = await orgService.getApiDetails(req.params.orgId);
    res.send(api);
  } catch (e) {
    Logger.error('OrgController::getApi');
    next(e);
  }
}
