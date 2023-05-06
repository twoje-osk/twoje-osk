import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  CreateUserDto,
  CreateUserSignupDto,
  UpdateUserDto,
  UserDto,
} from '../user/user.dto';

export class TraineeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty({ nullable: true })
  pesel: string | null;

  @ApiProperty()
  pkk: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  dateOfBirth: ApiDate;

  @ApiProperty({ nullable: true })
  driversLicenseNumber: string | null;

  @ApiProperty()
  driversLicenseCategoryId: number;
}

export class DtoCreateTrainee {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty()
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @Length(11, 11)
  pesel: string | null;

  @ApiProperty()
  @IsNotEmpty()
  pkk: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: ApiDate;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  driversLicenseNumber: string | null;

  @IsNotEmpty()
  driversLicenseCategoryId: number;
}

export class DtoCreateTraineeSignup {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserSignupDto)
  user: CreateUserSignupDto;

  @ApiProperty()
  @IsNotEmpty()
  pkk: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
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
  @Type(() => UpdateUserDto)
  user?: Partial<UpdateUserDto>;

  @ApiProperty()
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @Length(11, 11)
  pesel?: string | null;

  @ApiProperty()
  @IsOptional()
  pkk?: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: ApiDate;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  driversLicenseNumber?: string | null;
}

export class TraineeFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: TraineeDto,
  })
  trainees: TraineeDto[];
}

export class TraineeFindOneResponseDto {
  @ApiProperty()
  trainee: TraineeDto;
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
  trainee: TraineeDto;
}
