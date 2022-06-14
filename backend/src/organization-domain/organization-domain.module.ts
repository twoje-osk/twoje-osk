import { Global, Module } from '@nestjs/common';
import { OrganizationDomainService } from './organization-domain.service';

@Global()
@Module({
  providers: [OrganizationDomainService],
  exports: [OrganizationDomainService],
})
export class OrganizationDomainModule {}
