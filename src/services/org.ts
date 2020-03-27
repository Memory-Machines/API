import { Service } from 'typedi';
import { omit } from 'lodash';

import { IOrg, IOrgDoc } from '../models';
import { OrgRepo } from '../repositories';
import { createRandomString } from '../util';

@Service()
export class OrgService {
  constructor(private orgRepo: OrgRepo) {}

  public async getApiSecret(orgId: string): Promise<string> {
    try {
      const org = await this.orgRepo.findOne({ _id: orgId }, '+api');
      if (org) {
        return org.api.secret;
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async getApiDetails(orgId: string): Promise<any> {
    try {
      const org = await this.orgRepo.findOne({ _id: orgId }, '+api');
      if (org) {
        return omit(org.api, 'secret');
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async generateApiSecret(orgId: IOrgDoc['_id']): Promise<IOrgDoc & any> {
    try {
      const token = await createRandomString(36);
      const updatedOrg = await this.orgRepo.updateOne(
        { _id: orgId },
        {
          'api.secret': token,
          'api.active': true,
        },
        {
          select: '+api',
        }
      );
      if (updatedOrg) {
        return updatedOrg.api.secret;
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async createOrg(org: Partial<IOrg>): Promise<IOrgDoc & any> {
    try {
      const newOrg = await this.orgRepo.createOne(org);
      if (newOrg) {
        return newOrg;
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async list(options: { projection?: string | any } = {}): Promise<{ orgs: IOrgDoc[] }> {
    try {
      const orgs = await this.orgRepo.list(options);
      return orgs;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async loadOrg(_id: string, returnPlain = false, deleteApi = true): Promise<IOrgDoc & any> {
    try {
      const newOrg = await this.orgRepo.loadOrg(_id, returnPlain);
      if (newOrg) {
        if (deleteApi) delete newOrg.api;
        return newOrg;
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async findOrg(
    conditions: any,
    projection: any = {},
    deleteApi = true,
    returnPlain = false
  ): Promise<IOrgDoc & any> {
    try {
      const newOrg = await this.orgRepo.findOne(conditions, projection, returnPlain);
      if (newOrg) {
        if (deleteApi) delete newOrg.api;
        return newOrg;
      } else {
        return null;
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
