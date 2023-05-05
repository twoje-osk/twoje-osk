import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
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

const traineeFindAllQueryDtoSortByOptions = [
  'firstName',
  'lastName',
  'createdAt',
  'isActive',
] as const;
const traineeFindAllQueryDtoSortOrderOptions = ['asc', 'desc'] as const;
export class TraineeFindAllQueryDto {
  @ApiProperty({ required: false, enum: traineeFindAllQueryDtoSortByOptions })
  @IsOptional()
  @IsIn(traineeFindAllQueryDtoSortByOptions)
  sortBy?: typeof traineeFindAllQueryDtoSortByOptions[number];

  @ApiProperty({
    required: false,
    enum: traineeFindAllQueryDtoSortOrderOptions,
  })
  @IsOptional()
  @IsIn(traineeFindAllQueryDtoSortOrderOptions)
  sortOrder?: typeof traineeFindAllQueryDtoSortOrderOptions[number];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;
}

export class TraineeFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: TraineeDto,
  })
  trainees: TraineeDto[];

  @ApiProperty()
  total: number;
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
