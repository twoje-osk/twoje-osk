import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto, UpdateUserDto, UserDto } from '../user/user.dto';

export class InstructorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  instructorsQualificationsIds: number[];

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null;

  @ApiProperty()
  favouriteVehiclesIds: number[];
}

export class DtoCreateInstructor {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  instructorsQualificationsIds: number[];

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null;
}

export class DtoUpdateInstructor extends OmitType(
  PartialType(DtoCreateInstructor),
  ['user'],
) {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}

export class InstructorFindAllQueryDtoFilters {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchedPhrase?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === undefined) {
      return undefined;
    }

    const parsedValue = Number.parseInt(value, 10);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  })
  instructorQualification?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const isTrue = value === 'true';
    const isFalse = value === 'false';

    if (isTrue) {
      return true;
    }

    if (isFalse) {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}

const instructorFindAllQueryDtoSortByOptions = [
  'firstName',
  'lastName',
  'isActive',
] as const;
const instructorFindAllQueryDtoSortOrderOptions = ['asc', 'desc'] as const;
export class InstructorFindAllQueryDto {
  @ApiProperty({
    required: false,
    enum: instructorFindAllQueryDtoSortByOptions,
  })
  @IsOptional()
  @IsIn(instructorFindAllQueryDtoSortByOptions)
  sortBy?: typeof instructorFindAllQueryDtoSortByOptions[number];

  @ApiProperty({
    required: false,
    enum: instructorFindAllQueryDtoSortOrderOptions,
  })
  @IsOptional()
  @IsIn(instructorFindAllQueryDtoSortOrderOptions)
  sortOrder?: typeof instructorFindAllQueryDtoSortOrderOptions[number];

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

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => InstructorFindAllQueryDtoFilters)
  filters?: InstructorFindAllQueryDtoFilters;
}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: InstructorDto,
  })
  @ValidateNested()
  @Type(() => InstructorDto)
  instructors: InstructorDto[];

  @ApiProperty()
  total: number;
}

export class InstructorFindOneResponseDto {
  @ValidateNested()
  @ApiProperty()
  instructor: InstructorDto;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => DtoUpdateInstructor)
  instructor: DtoUpdateInstructor;
}

export class InstructorUpdateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class InstructorCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoCreateInstructor)
  instructor: DtoCreateInstructor;
}

export class InstructorCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
