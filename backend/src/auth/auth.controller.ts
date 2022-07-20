import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import { User } from 'users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SkipAuth } from './passport/skip-auth.guard';

interface LocalAuthGuardRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginAuthRequestDto,
  })
  @ApiResponse({
    type: LoginAuthResponseDto,
  })
  async login(
    @Request() req: LocalAuthGuardRequest,
  ): Promise<LoginAuthResponseDto> {
    return this.authService.login(req.user);
  }
}
