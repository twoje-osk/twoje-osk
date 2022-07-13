import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    const request = context.switchToHttp().getRequest() as AuthRequest;

    const { user } = request;

    return roles.includes(user.role);
  }
}
