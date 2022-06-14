import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthRequest, RequestOrganization } from 'auth/auth.types';

@Injectable({ scope: Scope.REQUEST })
export class OrganizationDomainService {
  constructor(@Inject(REQUEST) private request: AuthRequest) {}

  getRequestOrganization(): RequestOrganization {
    return this.request.organization;
  }
}
