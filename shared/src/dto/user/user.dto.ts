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
}

export class UserTestDto {
  @ApiProperty()
  user: DtoUser;
}
