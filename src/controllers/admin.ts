import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import uniqueString from 'unique-string';

import { Logger } from '../util';
import { AdminService } from '../services';
import { IAdmin } from '../models';

const adminService = Container.get(AdminService);

export async function listOrgs(req: Request, res: Response, next: NextFunction) {
  try {
    const orgs = await adminService.listOrgs();
    res.send(orgs);
  } catch (e) {
    Logger.error('AdminController::listOrgs');
    next(e);
  }
}

export async function listAdmins(req: Request, res: Response, next: NextFunction) {
  try {
    const admins = await adminService.listAdmins();
    res.send(admins);
  } catch (e) {
    Logger.error('AdminController::listAdmins');
    next(e);
  }
}

export async function createAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, email } = req.body;
    const data: IAdmin = { active: true, firstName, lastName, email, role: 'admin', password: uniqueString() };
    const admin = await adminService.createAdmin(data);
    res.send(admin);
  } catch (e) {
    Logger.error('AdminController::createAdmin');
    next(e);
  }
}

export async function loginAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await adminService.login(req.body.email, req.body.password);
    res.send(resp);
  } catch (e) {
    Logger.error('AdminController::loginAdmin');
    next(e);
  }
}

export async function createAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgName, ...user } = req.body;
    user.password = uniqueString();
    const org = await adminService.createOrgWithUser(user, orgName);
    res.send(org);
  } catch (e) {
    Logger.error('AdminController::createAccount');
    next(e);
  }
}

export async function deactivateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { adminId } = req.params;
    const admin = await adminService.deactivateAdmin(adminId);
    res.send(admin);
  } catch (e) {
    Logger.error('AdminController::deactivateAdmin');
    next(e);
  }
}

export async function activateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { adminId } = req.params;
    const admin = await adminService.activateAdmin(adminId);
    res.send(admin);
  } catch (e) {
    Logger.error('AdminController::deactivateAdmin');
    next(e);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await adminService.requestPasswordReset(email);
    res.send({ message: 'ok' });
  } catch (e) {
    Logger.error('AdminController::requestPasswordReset');
    next(e);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const { token, password } = req.body;
  try {
    await adminService.resetPassword(token, password);
    res.send({ message: 'ok' });
  } catch (e) {
    Logger.error('AdminController::resetPassword');
    next(e);
  }
}
