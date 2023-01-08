import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OrganizationGetPublicInfoResponseDto } from '@osk/shared';
import { SkipAuth } from '../auth/passport/skip-auth.guard';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';

@Controller('organization')
export class OrganizationsController {
  constructor(private readonly instructorsService: OrganizationDomainService) {}

  @SkipAuth()
  @ApiResponse({
    type: OrganizationGetPublicInfoResponseDto,
  })
  @Get()
  getPublicInfo(): OrganizationGetPublicInfoResponseDto {
    const organization = this.instructorsService.getRequestOrganization();

    return { organization };
  }
}
