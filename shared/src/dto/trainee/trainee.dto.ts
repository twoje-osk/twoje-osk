import { ApiProperty } from '@nestjs/swagger';
import { DtoUser } from '../user/user.dto';

export class DtoTrainee {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;

  @ApiProperty()
  pesel: string;

  @ApiProperty()
  pkk: string;

  @ApiProperty()
  driversLicenseNumber?: string;
}

export class TraineeFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoTrainee,
  })
  trainees: DtoTrainee[];
}

export class TraineeFindOneResponseDto {
  @ApiProperty()
  trainee: DtoTrainee;
}
