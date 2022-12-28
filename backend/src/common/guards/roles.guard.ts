import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@osk/shared';
import { AuthRequest } from '../../auth/auth.types';
import { SHOULD_SKIP_AUTH_KEY } from '../../auth/passport/skip-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const shouldSkipAuth = this.reflector.getAllAndOverride<boolean>(
      SHOULD_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkipAuth) {
      return true;
    }

    const controllerRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getClass(),
    );
    const methodRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    const roles = methodRoles ?? controllerRoles;

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as AuthRequest;

    return roles.includes(user.role);
  }
}
