import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SkipAuth } from './passport/skip-auth.guard';

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
  async login(@Request() req: any): Promise<LoginAuthResponseDto> {
    return this.authService.login(req.user);
  }
}
