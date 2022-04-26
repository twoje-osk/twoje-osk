import { JwtPayload } from '@osk/shared';
import { FastifyRequest } from 'fastify';

export interface RequestUser {
  userId: JwtPayload['sub'];
  organizationId: JwtPayload['organizationId'];
  email: JwtPayload['email'];
}

export interface AuthRequest extends FastifyRequest {
  user: RequestUser;
}
