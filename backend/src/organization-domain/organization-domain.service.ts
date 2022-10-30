import { AuthRequest, RequestOrganization } from 'auth/auth.types';
import { RequestContext } from 'nestjs-request-context';

export class OrganizationDomainService {
  getRequestOrganization(): RequestOrganization {
    const request = RequestContext.currentContext.req as AuthRequest;
    return request.organization;
  }
}
