import { UserRole } from 'dto/user/user.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
