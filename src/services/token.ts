import { Service } from 'typedi';

import { TokenRepo } from '../repositories';
import { UserService } from './user';
import { FGPSWDData, FGPSWDAdminData } from '../models';

@Service()
export class TokenService {
  constructor(private token: TokenRepo, private userService: UserService) {
    //
  }

  public async getPasswordResetToken(data: any): Promise<string> {
    try {
      const token = await this.token.createForgotPasswordToken(data);
      return token.value;
    } catch (e) {
      throw e;
    }
  }

  public async validatePasswordResetTokenAndReturnData(token: string): Promise<FGPSWDData | FGPSWDAdminData> {
    try {
      const tokenData: FGPSWDData | FGPSWDAdminData = await this.token.validateTokenAndReturnData(token);
      return tokenData;
    } catch (e) {
      throw e;
    }
  }

  public async removeToken(token: string): Promise<any> {
    try {
      await this.token.removeToken(token);
      return true;
    } catch (e) {
      throw e;
    }
  }
}
