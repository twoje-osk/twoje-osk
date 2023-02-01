import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: InstructorDto,
  })
  @ValidateNested()
  @Type(() => InstructorDto)
  instructors: InstructorDto[];
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
