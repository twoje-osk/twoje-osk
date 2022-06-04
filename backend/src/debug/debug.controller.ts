// eslint-disable-next-line max-classes-per-file
import { Controller, Get, Headers } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { SkipAuth } from 'auth/passport/skip-auth.guard';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';

class GetHostNameResponseDto {
  @ApiProperty()
  public hostname: string;
}

class GetOrganizationDomainDto {
  @ApiProperty()
  public organization: any;
}

@Controller('debug')
export class DebugController {
  constructor(
    private readonly organizationDomainService: OrganizationDomainService,
  ) {}

  @SkipAuth()
  @Get('hostname')
  @ApiResponse({
    type: GetHostNameResponseDto,
  })
  getHostName(@Headers('host') hostname: string): GetHostNameResponseDto {
    return { hostname };
  }

  @SkipAuth()
  @Get('organization')
  @ApiResponse({
    type: GetOrganizationDomainDto,
  })
  async getOrganizationDomain(): Promise<GetOrganizationDomainDto> {
    const organization =
      await this.organizationDomainService.getRequestNullableOrganization();

    return { organization };
  }
}
