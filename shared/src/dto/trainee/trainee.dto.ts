import { ApiProperty } from '@nestjs/swagger';
import { DtoUser } from '../user/user.dto';

export class DtoTrainee {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;
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
