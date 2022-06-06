import {
  Injectable,
  CanActivate,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { OrganizationDomainService } from '../organization-domain.service';

// TODO: Move db request to middleware
// TODO: Change guard bind from APP_GUARD to useGlobalGuards
// TODO: Check guard for static files
// TODO: Remove user organization relation fetching
// TODO: Custom branding
@Injectable({ scope: Scope.REQUEST })
export class OrganizationExistsGuard implements CanActivate {
  constructor(private organizationDomainService: OrganizationDomainService) {}

  async canActivate(): Promise<boolean> {
    const organization =
      await this.organizationDomainService.getRequestNullableOrganization();

    if (organization === null) {
      throw new NotFoundException();
    }

    return true;
  }
}
