import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import * as HttpStatus from 'http-status-codes';

import constants from '../util/constants';
import { AdminRepo } from '../repositories';
import { UserService } from './user';
import { IUser, IAdmin, IAdminDoc, IOrgDoc, FGPSWDAdminData } from '../models';
import { OrgService } from './org';
import { HTTPException } from '../exceptions';
import { TokenService } from './token';
import { sendMailSync } from './mailer';
import { Logger, CONSTANTS } from '../util';

const { EMAIL_DATA } = constants;

const adminHost = CONSTANTS.config.server.admin;

@Service()
export class AdminService {
  private JWT_SECRET: string = CONSTANTS.config.server.jwtSecret;

  constructor(
    private tokenService: TokenService,
    private orgService: OrgService,
    private userService: UserService,
    private admin: AdminRepo
  ) {
    //
  }

  public generateJWT(admin: IAdminDoc): string {
    try {
      const token = jwt.sign({ data: { _id: admin._id } }, this.JWT_SECRET, { expiresIn: '3h' });
      return token;
    } catch (e) {
      Logger.error('AdminService::generateJWT');
      throw new HTTPException(500, 'Token generation failed');
    }
  }

  public async login(email: string, password: string): Promise<{ jwtToken: string; admin: IAdmin }> {
    try {
      const admin = await this.admin.findOne({ email }, '+password +active', '', true);
      if (!admin) {
        throw new HTTPException(HttpStatus.NOT_ACCEPTABLE, 'Invalid Email or Password');
      }
      if (!admin.active) {
        throw new HTTPException(HttpStatus.FORBIDDEN, 'Admin Inactive');
      }
      const matched = await this.admin.comparePassword(password, admin.password);
      delete admin.password;
      if (matched) {
        const jwtToken = this.generateJWT(admin);
        return {
          jwtToken,
          admin,
        };
      } else {
        return Promise.reject(new HTTPException(400, 'Password does not match'));
      }
    } catch (e) {
      Logger.error('AdminService::login');
      return Promise.reject(e);
    }
  }

  public async loadAdmin(id: string): Promise<IAdminDoc> {
    try {
      const admin = await this.admin.findOne({ _id: id }, {}, '', true);
      return admin;
    } catch (e) {
      Logger.error('AdminService::loadAdmin');
      return Promise.reject(e);
    }
  }

  public async listOrgs(): Promise<{ orgs: IOrgDoc[] }> {
    try {
      const orgs = await this.orgService.list({
        projection: {
          _id: 1,
          active: 1,
          name: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          'api.active': 1,
        },
      });
      return orgs;
    } catch (e) {
      Logger.error('AdminService::listOrgs');
      return Promise.reject(e);
    }
  }

  public async listAdmins(): Promise<{ admins: IAdminDoc[] }> {
    try {
      const admins = await this.admin.list();
      return admins;
    } catch (e) {
      Logger.error('AdminService::listAdmins');
      return Promise.reject(e);
    }
  }

  public async createAdmin(admin: IAdmin): Promise<IAdmin> {
    try {
      const adminDoc = await this.admin.createOne(admin);
      return adminDoc;
    } catch (e) {
      Logger.error('AdminService::createAdmin');
      return Promise.reject(e);
    }
  }

  public async createOrgWithUser(user: IUser, name: string): Promise<IOrgDoc> {
    try {
      const { org } = await this.userService.registerUserWithOrg(user, { name });
      return org;
    } catch (e) {
      Logger.error('AdminService::createOrgWithUser');
      return Promise.reject(e);
    }
  }

  public async deactivateAdmin(adminId: string): Promise<IAdminDoc> {
    try {
      const admin = await this.admin.updateAccount(adminId, { active: false });
      return admin;
    } catch (e) {
      Logger.error('AdminService::deactivateAdmin');
      return Promise.reject(e);
    }
  }

  public async activateAdmin(adminId: string): Promise<IAdminDoc> {
    try {
      const admin = await this.admin.updateAccount(adminId, { active: true });
      return admin;
    } catch (e) {
      Logger.error('AdminService::activateAdmin');
      return Promise.reject(e);
    }
  }

  public async requestPasswordReset(email: string): Promise<null> {
    try {
      const admin = await this.admin.findOne({ email }, {}, '', true);
      if (!admin) {
        throw new Error('Admin with this email does not exist.');
      }
      const data: FGPSWDAdminData = { email: admin.email, adminId: admin._id };
      const token = await this.tokenService.getPasswordResetToken(data);
      const resetUrl = adminHost + '/account/password/reset' + '?token=' + token;
      await sendMailSync(
        { to: [admin.email], from: EMAIL_DATA.frgtPswd.from, subject: EMAIL_DATA.frgtPswd.subject },
        {
          template: EMAIL_DATA.frgtPswd.template,
          templateData: { token: token, resetUrl, name: admin.firstName },
        }
      );
      return;
    } catch (e) {
      Logger.error('AdminService::requestPasswordReset');
      throw e;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const tokenData: FGPSWDAdminData = (await this.tokenService.validatePasswordResetTokenAndReturnData(
        token
      )) as FGPSWDAdminData;
      await this.updatePassword(tokenData.adminId, '', newPassword, true);
      await this.tokenService.removeToken(token);
      return;
    } catch (e) {
      Logger.error('AdminService::resetPassword');
      throw e;
    }
  }

  public async updatePassword(
    adminId: string,
    oldPswd: string,
    newPswd: string,
    bypassCheck = false
  ): Promise<IAdminDoc> {
    try {
      const existAdmin = await this.admin.findOne({ _id: adminId }, { password: 1 }, '', true);
      if (!bypassCheck) {
        const isAMatch = await this.admin.comparePassword(oldPswd, existAdmin.password);
        if (!isAMatch) {
          return Promise.reject(new Error('Your current password is incorrect'));
        }
      }
      const hash = await this.admin.hashPassword(newPswd);
      const newAdmin = await this.admin.updateAccount(adminId, { password: hash });
      return newAdmin;
    } catch (e) {
      Logger.error('AdminService::updatePassword');
      return Promise.reject(e);
    }
  }
}
