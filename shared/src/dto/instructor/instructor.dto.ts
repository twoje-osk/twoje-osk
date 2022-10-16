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
import { DtoCreateUser, DtoUpdateUser, DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoUser)
  user: DtoUser;

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
  instructorsQualifications: number[];

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null;
}

export class DtoCreateInstructor {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoCreateUser)
  user: DtoCreateUser;

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
  instructorsQualifications: number[];

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
  @Type(() => DtoUpdateUser)
  user: DtoUpdateUser;
}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoInstructor,
  })
  @ValidateNested()
  @Type(() => DtoInstructor)
  instructors: DtoInstructor[];
}

export class InstructorFindOneResponseDto {
  @ValidateNested()
  @ApiProperty()
  instructor: DtoInstructor;
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
