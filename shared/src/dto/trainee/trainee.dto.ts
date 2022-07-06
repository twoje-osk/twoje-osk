import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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

  @ApiProperty({ nullable: true })
  driversLicenseNumber: string | null;
}

export class DtoCreateTrainee {
  @ApiProperty()
  user: DtoUser;

  @ApiProperty()
  pesel: string;

  @ApiProperty()
  pkk: string;

  @ApiProperty({ nullable: true })
  driversLicenseNumber: string | null;
}

export class DtoUpdateTrainee extends PartialType(DtoCreateTrainee) {}

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

export class TraineeUpdateResponseDto {}

export class TraineeUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  trainee: DtoUpdateTrainee;
}
