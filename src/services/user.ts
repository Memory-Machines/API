import { Service } from 'typedi';
import jwt from 'jsonwebtoken';

import { IUser, IUserPopulated, IUserDoc, IOrgDoc, IOrg } from '../models';
import { UserRepo } from '../repositories';
import { HTTPException } from '../exceptions';
import { OrgService } from './org';
import { sendMail } from './mailer';
import { CONSTANTS } from '../util';

const { EMAIL_DATA, config } = CONSTANTS;

@Service()
export class UserService {
  private JWT_SECRET: string = config.server.jwtSecret;

  constructor(private userRepo: UserRepo, private orgService: OrgService) {}

  public generateJWT(user: IUserDoc): string {
    try {
      const token = jwt.sign({ data: { _id: user._id } }, this.JWT_SECRET, { expiresIn: '168h' });
      return token;
    } catch (e) {
      throw new HTTPException(500, 'Token generation failed');
    }
  }

  public async login(email: string, password: string): Promise<{ jwtToken: string; user: IUser }> {
    try {
      const user = await this.userRepo.findOne({ email }, '+password', 'teams.org', true);
      if (!user) {
        return Promise.reject(new HTTPException(400, 'Invalid Email or Password'));
      }
      const matched = await this.userRepo.comparePassword(password, user.password);
      delete user.password;
      if (matched) {
        const jwtToken = this.generateJWT(user);
        return {
          jwtToken,
          user,
        };
      } else {
        return Promise.reject(new HTTPException(400, 'Password does not match'));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async registerUser(user: IUser): Promise<{ jwtToken: string; user: IUser }> {
    try {
      const newUser = await this.createUser(user);
      delete newUser.password;
      const jwtToken = this.generateJWT(newUser);
      sendMail(
        {
          to: [newUser.email],
          subject: EMAIL_DATA.newAccount.subject,
          from: EMAIL_DATA.newAccount.from,
        },
        {
          template: 'newAccount',
          templateData: {
            user: newUser.firstName,
            loginUrl: EMAIL_DATA.newAccount.loginUrl,
          },
        }
      );
      return {
        jwtToken,
        user: newUser,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async registerUserWithOrg(user: IUser, orgData: Partial<IOrg>): Promise<{ org: IOrgDoc }> {
    try {
      const newUser = await this.createUser(user);
      const org = await this.createOrg(orgData, newUser);
      sendMail(
        {
          to: [newUser.email],
          subject: EMAIL_DATA.newAccount.subject,
          from: EMAIL_DATA.newAccount.from,
        },
        {
          template: 'newAccount',
          templateData: {
            user: newUser.firstName,
            loginUrl: EMAIL_DATA.newAccount.loginUrl,
          },
        }
      );
      return { org };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async loadUserWithOrgDetails(_id: string): Promise<IUserDoc> {
    try {
      const user = await this.userRepo.findUserWithPopulatedOrg(_id, true);
      return user;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async createOrg(org: Partial<IOrg>, user: IUserDoc | IUserPopulated): Promise<IOrgDoc> {
    try {
      org.email = user.email;
      const newOrg = await this.orgService.createOrg(org);
      await this.addToTeam(user, newOrg, '*', true);
      return newOrg;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async createUser(user: IUser): Promise<IUserDoc> {
    try {
      const newUser = await this.userRepo.createOne(user);
      return newUser;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async findUserWithEmail(email: string): Promise<IUserDoc> {
    try {
      const user = await this.userRepo.findOne({ email }, {}, '', true);
      return user;
    } catch (e) {
      throw e;
    }
  }

  public async updateEmail(userId: string, email: string): Promise<IUserDoc> {
    try {
      const existUser = await this.userRepo.findOne({ email }, {}, '', true);
      if (existUser) {
        return Promise.reject(new Error('User with this email already exist'));
      }
      const newUser = await this.userRepo.updateAccount(userId, { email });
      return newUser;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async updatePassword(
    userId: string,
    oldPswd: string,
    newPswd: string,
    bypassCheck = false
  ): Promise<IUserDoc> {
    try {
      const existUser = await this.userRepo.findOne({ _id: userId }, { password: 1 }, '', true);
      if (!bypassCheck) {
        const isAMatch = await this.userRepo.comparePassword(oldPswd, existUser.password);
        if (!isAMatch) {
          return Promise.reject(new Error('Your current password is incorrect'));
        }
      }
      const hash = await this.userRepo.hashPassword(newPswd);
      const newUser = await this.userRepo.updateAccount(userId, { password: hash });
      return newUser;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async updateName(userId: string, data: { firstName: string; lastName: string }): Promise<IUserDoc> {
    try {
      const newUser = await this.userRepo.updateAccount(userId, data);
      return newUser;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async addToTeam(
    user: IUserDoc | IUserPopulated,
    org: IOrgDoc,
    acl: string[] | string,
    isOwner = false
  ): Promise<IUserDoc> {
    try {
      const normalizedAcl = Array.isArray(acl) ? acl : [acl];
      const newUser = await this.userRepo.addUserToOrg(user._id, org._id, normalizedAcl, isOwner);
      return newUser;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
