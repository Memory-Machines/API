import { Service } from 'typedi';

import { OrgModel, IOrg, IOrgModel, IOrgDoc } from '../models';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

@Service()
export class OrgRepo {
  protected orgModel: IOrgModel = OrgModel;

  constructor() {
    //
  }

  public async list(options: { projection?: string | any }): Promise<{ orgs: IOrgDoc[] }> {
    try {
      const docs = await this.orgModel
        .find({}, options.projection)
        .lean()
        .read('sp')
        .exec();
      return { orgs: docs };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async loadOrg(id: string, returnPlain = false): Promise<IOrgDoc> {
    try {
      const query = this.orgModel.findOne({ _id: id });

      if (returnPlain) {
        query.lean();
      }

      const org = await query;

      if (org && !returnPlain) {
        return org.toObject();
      } else if (org && returnPlain) {
        return org;
      }

      return null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async findOne(condition: any, projection: any = {}, returnPlain = false): Promise<IOrgDoc> {
    try {
      const query = this.orgModel.findOne(condition, projection);

      if (returnPlain) {
        query.lean();
      }

      const org = await query;

      if (org && !returnPlain) {
        return org.toObject();
      } else if (org && returnPlain) {
        return org;
      }

      return null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async updateOne(
    condition: any,
    patch: any = {},
    options: QueryFindOneAndUpdateOptions = {}
  ): Promise<IOrgDoc> {
    try {
      const updatedOrg = await this.orgModel.findOneAndUpdate(condition, patch, { ...options, new: true }).exec();
      return updatedOrg.toObject();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async createOne(org: Partial<IOrg>): Promise<IOrgDoc> {
    try {
      const newOrg = new this.orgModel(org);
      await newOrg.save();
      return newOrg.toObject();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
