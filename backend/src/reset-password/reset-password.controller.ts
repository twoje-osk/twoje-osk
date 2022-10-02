import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '@osk/shared';
import { SkipAuth } from 'auth/passport/skip-auth.guard';
import { ResetPasswordService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @SkipAuth()
  @Post('forgot')
  @ApiBody({
    type: ForgotPasswordRequestDto,
  })
  @ApiResponse({
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() { email }: ForgotPasswordRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<ForgotPasswordResponseDto> {
    const isHttps = req.protocol === 'https';
    // Important! No await to mitigate timing attack
    this.resetPasswordService.initiatePasswordReset(email, isHttps);

    return {};
  }

  @SkipAuth()
  @Post('reset')
  @ApiBody({
    type: ResetPasswordRequestDto,
  })
  @ApiResponse({
    type: ResetPasswordResponseDto,
  })
  async resetPassword(
    @Body() { token, password }: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    const result = await this.resetPasswordService.resetPassword(
      token,
      password,
    );

    if (!result.ok && result.error === 'TOKEN_NOT_FOUND') {
      throw new NotFoundException();
    }

    return {};
  }
}
