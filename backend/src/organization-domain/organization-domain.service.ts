import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Organization } from 'organizations/entities/organization.entity';
import { OrganizationsService } from 'organizations/organizations.service';

@Injectable({ scope: Scope.REQUEST })
export class OrganizationDomainService {
  constructor(
    private readonly organizationsService: OrganizationsService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  async getRequestNullableOrganization(): Promise<Organization | null> {
    const { host } = this.request.headers;

    if (host === undefined) {
      throw new Error('No host header defined');
    }

    const [domain] = host.split(':')!;
    const subdomains = domain!.split('.');
    const firstSubdomain = subdomains[0]!;

    return this.organizationsService.getOrganizationBySlug(firstSubdomain);
  }

  async getRequestOrganization(): Promise<Organization> {
    return (await this.getRequestNullableOrganization())!;
  }
}
