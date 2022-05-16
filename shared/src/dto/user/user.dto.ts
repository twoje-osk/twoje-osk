import { ApiProperty } from '@nestjs/swagger';

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
  createdAt: Date;
}

export class UserTestDto {
  @ApiProperty()
  user: DtoUser;
}
