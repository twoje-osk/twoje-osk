import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@osk/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
