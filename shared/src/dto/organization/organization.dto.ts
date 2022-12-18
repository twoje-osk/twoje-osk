import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class OrganizationGetPublicInfoResponseDto {
  @ApiProperty({
    type: OrganizationDto,
  })
  organization: OrganizationDto;
}
