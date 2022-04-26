import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    type: LoginAuthResponseDto,
  })
  async login(
    @Request() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _body: LoginAuthRequestDto,
  ): Promise<LoginAuthResponseDto> {
    return this.authService.login(req.user);
  }
}
