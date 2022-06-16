import { JwtPayload } from '@osk/shared';
import { Request } from 'express';

export interface RequestUser {
  userId: JwtPayload['sub'];
  email: JwtPayload['email'];
}

export interface RequestOrganization {
  id: number;
  name: string;
  slug: string;
}

export interface AuthRequest extends Request {
  user: RequestUser;
  organization: RequestOrganization;
}
