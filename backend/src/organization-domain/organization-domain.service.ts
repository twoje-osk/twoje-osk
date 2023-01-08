import { RequestContext } from 'nestjs-request-context';
import { RequestOrganization, AuthRequest } from '../auth/auth.types';

export class OrganizationDomainService {
  getRequestOrganization(): RequestOrganization {
    const request = RequestContext.currentContext.req as AuthRequest;
    return request.organization;
  }
}
