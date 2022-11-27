import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  DtoCreateUser,
  DtoCreateUserSignup,
  DtoUpdateUser,
  DtoUser,
} from '../user/user.dto';

export class DtoTrainee {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;

  @ApiProperty()
  pesel: string | null;

  @ApiProperty()
  pkk: string;

  @ApiProperty()
  dateOfBirth: ApiDate;

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
  @IsNumberString({ no_symbols: true })
  @Length(11, 11)
  pesel: string | null;

  @ApiProperty()
  @IsNotEmpty()
  pkk: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  dateOfBirth: ApiDate;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  driversLicenseNumber: string | null;
}

export class DtoCreateTraineeSignup {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoCreateUserSignup)
  user: DtoCreateUserSignup;

  @ApiProperty()
  @IsNotEmpty()
  pkk: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  dateOfBirth: ApiDate;

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
  @IsNumberString({ no_symbols: true })
  @Length(11, 11)
  pesel?: string | null;

  @ApiProperty()
  @IsOptional()
  pkk?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  dateOfBirth?: ApiDate;

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

export class TraineeAddNewRequestSignupDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoCreateTraineeSignup)
  trainee: DtoCreateTraineeSignup;
}

export class TraineeAddNewResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  trainee: DtoTrainee;
}

export class TraineeDisableResponseDto {}

export class TraineeDisableRequestDto {}
