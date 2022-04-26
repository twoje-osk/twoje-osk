import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SHOULD_SKIP_AUTH_KEY } from './skip-auth.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const shouldSkipAuth = this.reflector.getAllAndOverride<boolean>(
      SHOULD_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkipAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
