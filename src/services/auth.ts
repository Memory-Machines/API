import { Service } from 'typedi';

import { CONSTANTS } from '../util';
import { TokenService } from './token';
import { sendMailSync } from './mailer';
import { FGPSWDData } from '../models';
import { UserService } from './user';

const appHost = CONSTANTS.config.server.app;

@Service()
export class AuthService {
  constructor(private tokenService: TokenService, private userService: UserService) {
    //
  }

  public async requestPasswordReset(email: string): Promise<null> {
    try {
      const user = await this.userService.findUserWithEmail(email);
      if (!user) {
        throw new Error('User with this email does not exist.');
      }
      const token = await this.tokenService.getPasswordResetToken({ email: user.email, userId: user._id });
      const resetUrl = appHost + '/account/password/reset' + '?token=' + token;
      await sendMailSync(
        { to: [user.email], from: CONSTANTS.EMAIL_DATA.frgtPswd.from, subject: CONSTANTS.EMAIL_DATA.frgtPswd.subject },
        {
          template: CONSTANTS.EMAIL_DATA.frgtPswd.template,
          templateData: { token: token, resetUrl, name: user.firstName },
        }
      );
      return;
    } catch (e) {
      throw e;
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const tokenData: FGPSWDData = (await this.tokenService.validatePasswordResetTokenAndReturnData(
        token
      )) as FGPSWDData;
      await this.userService.updatePassword(tokenData.userId, '', newPassword, true);
      await this.tokenService.removeToken(token);
      return;
    } catch (e) {
      throw e;
    }
  }
}
