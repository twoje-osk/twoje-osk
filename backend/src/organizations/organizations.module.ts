import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

@Module({
  providers: [OrganizationsService],
  imports: [TypeOrmModule.forFeature([Organization])],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
