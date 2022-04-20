import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { LoginAuthDto } from '@osk/shared';
import { UserService } from 'user/user.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() { email, password }: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
