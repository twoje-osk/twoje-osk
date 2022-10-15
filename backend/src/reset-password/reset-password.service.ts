import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UsersService } from 'users/users.service';
import { Try, getFailure, getSuccess } from 'types/Try';
import { add } from 'date-fns';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CustomConfigService } from 'config/config.service';
import { MailService } from 'mail/mail.service';
import { ResetPasswordToken } from './entities/reset-password-token.entity';
import { getToken, hashToken } from './reset-password.utils';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPasswordToken)
    private resetPasswordTokenRepository: Repository<ResetPasswordToken>,
    private usersService: UsersService,
    private organizationDomainService: OrganizationDomainService,
    private mailService: MailService,
    private configService: CustomConfigService,
  ) {}

  public async createToken(
    userId: number,
  ): Promise<Try<string, 'USER_NOT_FOUND'>> {
    const expireDate = add(new Date(), { hours: 1 });

    const { hashedToken, token } = await getToken();
    const resetPasswordToken = {
      isValid: true,
      expireDate,
      user: { id: userId },
      token: hashedToken,
    };

    await this.resetPasswordTokenRepository.insert(resetPasswordToken);

    return getSuccess(token);
  }

  public async getUserByToken(
    token: string,
  ): Promise<Try<ResetPasswordToken, 'TOKEN_NOT_FOUND'>> {
    const hashedToken = hashToken(token);
    const resetToken = await this.resetPasswordTokenRepository.findOne({
      where: {
        token: hashedToken,
        expireDate: MoreThanOrEqual(new Date()),
        isValid: true,
      },
      relations: {
        user: true,
      },
    });

    if (resetToken === null) {
      return getFailure('TOKEN_NOT_FOUND');
    }

    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    if (resetToken.user.organizationId !== organizationId) {
      return getFailure('TOKEN_NOT_FOUND');
    }

    return getSuccess(resetToken);
  }

  public async invalidateToken(tokenId: number) {
    await this.resetPasswordTokenRepository.update(
      {
        id: tokenId,
      },
      {
        isValid: false,
      },
    );
  }

  async sendResetEmail(email: string, token: string, isHttps: boolean) {
    const hostname = this.configService.get('hostname');
    const protocol = isHttps ? 'https' : 'http';
    const { slug } = this.organizationDomainService.getRequestOrganization();
    const resetPasswordUrl = `${protocol}://${slug}.${hostname}/account/reset/${token}`;

    await this.mailService.sendEmail(email, 'Password reset', {
      html: `<a href="${resetPasswordUrl}">Zresetuj hasło</a>`,
      text: `${resetPasswordUrl}`,
    });
  }

  async initiatePasswordReset(
    email: string,
    isHttps: boolean,
  ): Promise<Try<undefined, 'UNABLE_TO_CREATE_TOKEN'>> {
    const user = await this.usersService.findOneByEmail(email);

    if (user === null) {
      return getFailure('UNABLE_TO_CREATE_TOKEN');
    }

    const result = await this.createToken(user.id);

    if (!result.ok) {
      return getFailure('UNABLE_TO_CREATE_TOKEN');
    }

    const token = result.data;
    this.sendResetEmail(email, token, isHttps);

    return getSuccess(undefined);
  }

  @Transactional()
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<Try<undefined, 'TOKEN_NOT_FOUND'>> {
    const userResult = await this.getUserByToken(token);

    if (!userResult.ok) {
      return getFailure('TOKEN_NOT_FOUND');
    }

    const { user, id: tokenId } = userResult.data;
    const { id: userId } = user;

    await this.usersService.changePassword(userId, newPassword);
    await this.invalidateToken(tokenId);

    return getSuccess(undefined);
  }
}
