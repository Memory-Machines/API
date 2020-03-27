import { Service } from 'typedi';
import bcrypt from 'bcrypt';

import { UserModel, IUser, IUserModel, IUserDoc } from '../models';

@Service()
export class UserRepo {
  protected userModel: IUserModel = UserModel;
  private SALT_ROUNDS = 10;

  public async findUserWithPopulatedOrg(_id: string, returnPlain = false): Promise<IUserDoc> {
    try {
      const query = this.userModel.findOne({ _id }).populate('teams.org');
      if (returnPlain) {
        query.lean();
      }
      const user = await query.exec();
      if (user && !returnPlain) {
        return user.toObject();
      } else if (user && returnPlain) {
        return user;
      }
      return null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async findOne(condition: any, projection: any = {}, populate = '', returnPlain = false): Promise<IUserDoc> {
    try {
      const userQuery = this.userModel.findOne(condition, projection);
      if (populate) {
        userQuery.populate(populate);
      }
      if (returnPlain) {
        userQuery.lean();
      }
      const user = await userQuery.exec();
      if (user && !returnPlain) {
        return user.toObject();
      } else if (user && returnPlain) {
        return user;
      }
      return null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async updateAccount(userId: string, patch: any = {}): Promise<IUserDoc> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ _id: userId }, patch, { new: true });
      return updatedUser.toObject();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async comparePassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const matched = await bcrypt.compare(password, storedHash);
      return matched;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async addUserToOrg(userId: string, orgId: string, acl: string[], isOwner: boolean) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            teams: {
              acl: acl,
              org: orgId,
              owner: isOwner,
            },
          },
        },
        {
          new: true,
        }
      );
      return user.toObject();
    } catch (e) {
      throw e;
    }
  }

  public async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    return hash;
  }

  public async createOne(user: IUser): Promise<IUserDoc> {
    try {
      const newUser = new this.userModel(user);
      const hashPassword = await this.hashPassword(newUser.password);
      newUser.password = hashPassword;
      await newUser.save();
      return newUser.toObject();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
