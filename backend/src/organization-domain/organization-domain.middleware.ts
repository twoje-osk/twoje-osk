import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { AuthRequest } from 'auth/auth.types';
import { Response, NextFunction } from 'express';
import { OrganizationsService } from 'organizations/organizations.service';

// TODO: Custom branding
@Injectable()
export class OrganizationDomainMiddleware implements NestMiddleware {
  constructor(private organizationsService: OrganizationsService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const { host } = req.headers;

    if (host === undefined) {
      throw new Error('No host header defined');
    }

    const [domain] = host.split(':');
    const subdomains = domain?.split('.');
    const firstSubdomain = subdomains?.[0];

    if (!firstSubdomain) {
      throw new NotFoundException();
    }

    const organization = await this.organizationsService.getOrganizationBySlug(
      firstSubdomain,
    );

    if (organization === null) {
      throw new NotFoundException();
    }

    req.organization = organization;

    next();
  }
}
