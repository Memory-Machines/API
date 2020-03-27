import { Service } from 'typedi';
import bcrypt from 'bcrypt';

import { AdminModel, IAdmin, IAdminModel, IAdminDoc } from '../models';
import { Logger } from '../util';

@Service()
export class AdminRepo {
  protected adminModel: IAdminModel = AdminModel;
  private SALT_ROUNDS = 10;

  public async list(): Promise<{ admins: IAdminDoc[] }> {
    try {
      const docs = await this.adminModel
        .find({})
        .lean()
        .read('sp')
        .exec();
      return { admins: docs };
    } catch (e) {
      Logger.error('AdminRepo::list');
      return Promise.reject(e);
    }
  }

  public async findOne(condition: any, projection: any = {}, populate = '', returnPlain = false): Promise<IAdminDoc> {
    try {
      const adminQuery = this.adminModel.findOne(condition, projection);
      if (populate) {
        adminQuery.populate(populate);
      }
      if (returnPlain) {
        adminQuery.lean();
      }
      const admin = await adminQuery.exec();
      if (admin && !returnPlain) {
        return admin.toObject();
      } else if (admin && returnPlain) {
        return admin;
      }
      return null;
    } catch (e) {
      Logger.error('AdminRepo::findOne');
      return Promise.reject(e);
    }
  }

  public async updateAccount(adminId: string, patch: any = {}): Promise<IAdminDoc> {
    try {
      const updtdAdmin = await this.adminModel.findOneAndUpdate({ _id: adminId }, patch, { new: true });
      return updtdAdmin.toObject();
    } catch (e) {
      Logger.error('AdminRepo::updateAccount');
      return Promise.reject(e);
    }
  }

  public async comparePassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const matched = await bcrypt.compare(password, storedHash);
      return matched;
    } catch (e) {
      Logger.error('AdminRepo::comparePassword');
      return Promise.reject(e);
    }
  }

  public async hashPassword(password: string) {
    try {
      const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
      return hash;
    } catch (e) {
      Logger.error('AdminRepo::hashPassword');
      return Promise.reject(e);
    }
  }

  public async createOne(admin: IAdmin): Promise<IAdminDoc> {
    try {
      const newAdmin = new this.adminModel(admin);
      const hashPassword = await this.hashPassword(newAdmin.password);
      newAdmin.password = hashPassword;
      await newAdmin.save();
      return newAdmin.toObject();
    } catch (e) {
      Logger.error('AdminRepo::createOne');
      return Promise.reject(e);
    }
  }
}
