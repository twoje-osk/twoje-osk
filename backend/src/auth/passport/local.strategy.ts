import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthRequest } from 'auth/auth.types';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private moduleRef: ModuleRef) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(request: AuthRequest, email: string, password: string) {
    const user = await this.authService.validateUser(
      email,
      password,
      request.organization,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
