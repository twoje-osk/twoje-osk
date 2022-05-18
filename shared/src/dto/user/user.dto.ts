import { ApiProperty } from '@nestjs/swagger';
import { DtoOrganization } from '../organization/organization.dto';

export class DtoUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  createdAt: ApiDate;

  @ApiProperty()
  organization: DtoOrganization;
}

export class UserMyProfileResponseDto {
  @ApiProperty()
  user: DtoUser;
}
