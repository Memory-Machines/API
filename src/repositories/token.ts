import { Service } from 'typedi';

import { ITokenModel, TokenModel, FGPSWDData, TokenTypes, ITokenDoc } from '../models';

@Service()
export class TokenRepo {
  protected tokenModel: ITokenModel = TokenModel;

  public async createForgotPasswordToken(data: FGPSWDData): Promise<ITokenDoc> {
    try {
      const tokenDoc = new this.tokenModel({
        data,
        type: TokenTypes.FORGOT_PASSWORD,
      });
      await tokenDoc.save();
      const token = tokenDoc.toObject();
      return token;
    } catch (e) {
      throw new Error('Error generating a token');
    }
  }

  public async validateTokenAndReturnData(token: string): Promise<any> {
    try {
      const tokenDoc = await this.tokenModel
        .findOne({ value: token })
        .lean()
        .exec();
      if (!tokenDoc) {
        throw new Error('Token not valid');
      }
      const expires = new Date(tokenDoc.expires);
      const now = new Date();
      if (now < expires) {
        return tokenDoc.data;
      }
      throw new Error('Token is not valid');
    } catch (e) {
      throw new Error('Token is not valid');
    }
  }

  public async removeToken(token: string): Promise<any> {
    try {
      await this.tokenModel.deleteOne({ value: token });
      return;
    } catch (e) {
      throw new Error('Error Deleting Token');
    }
  }
}
