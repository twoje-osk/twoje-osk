import { RequestContext } from 'nestjs-request-context';
import { AuthRequest, RequestUser } from 'auth/auth.types';

export class CurrentUserService {
  getRequestCurrentUser(): RequestUser {
    const request = RequestContext.currentContext.req as AuthRequest;
    return request.user;
  }
}
