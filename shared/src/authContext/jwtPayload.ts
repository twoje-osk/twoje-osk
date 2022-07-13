import { UserRole } from 'types/user.types';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
