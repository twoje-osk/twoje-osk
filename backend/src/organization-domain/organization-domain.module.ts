import { Global, Module } from '@nestjs/common';
import { OrganizationsModule } from 'organizations/organizations.module';
import { OrganizationDomainService } from './organization-domain.service';

@Global()
@Module({
  providers: [OrganizationDomainService],
  exports: [OrganizationDomainService],
  imports: [OrganizationsModule],
})
export class OrganizationDomainModule {}
