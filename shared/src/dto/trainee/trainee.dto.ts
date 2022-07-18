import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DtoCreateUser, DtoUpdateUser, DtoUser } from '../user/user.dto';

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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoCreateUser)
  user: DtoCreateUser;

  @ApiProperty()
  @IsNotEmpty()
  pesel: string;

  @ApiProperty()
  @IsNotEmpty()
  pkk: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  driversLicenseNumber: string | null;
}

export class DtoUpdateTrainee {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => DtoUpdateUser)
  user?: Partial<DtoUpdateUser>;

  @ApiProperty()
  @IsOptional()
  pesel?: string;

  @ApiProperty()
  @IsOptional()
  pkk?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  driversLicenseNumber?: string | null;
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

export class TraineeUpdateResponseDto {}

export class TraineeUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoUpdateTrainee)
  trainee: DtoUpdateTrainee;
}

export class TraineeAddNewRequestDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoCreateTrainee)
  trainee: DtoCreateTrainee;
}

export class TraineeAddNewResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  trainee: DtoTrainee;
}

export class TraineeDisableResponseDto {}

export class TraineeDisableRequestDto {}
