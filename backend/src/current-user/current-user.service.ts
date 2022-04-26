import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest, RequestUser } from 'auth/auth.types';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  constructor(@Inject(REQUEST) private request: AuthRequest) {}

  getRequestCurrentUser(): RequestUser {
    return this.request.user;
  }
}
