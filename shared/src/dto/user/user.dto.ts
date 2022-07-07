import { ApiProperty } from '@nestjs/swagger';
import { DtoOrganization } from '../organization/organization.dto';

export enum UserRole {
  Trainee = 'trainee',
  Instructor = 'instructor',
  Admin = 'admin',
}

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

  @ApiProperty({
    type: 'string',
  })
  createdAt: ApiDate;

  @ApiProperty()
  organization: DtoOrganization;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class UserMyProfileResponseDto {
  @ApiProperty()
  user: DtoUser;
}
