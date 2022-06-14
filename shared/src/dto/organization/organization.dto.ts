import { ApiProperty } from '@nestjs/swagger';

export class DtoOrganization {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class OrganizationGetPublicInfoResponseDto {
  @ApiProperty({
    type: DtoOrganization,
  })
  organization: DtoOrganization;
}
