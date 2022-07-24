import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DtoDriversLicenseCategory } from '../driversLicenseCategory/driversLicenseCategory.dto';
import { DtoCreateUser, DtoUpdateUser, DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
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
  photo: string | null | undefined;
}

export class DtoLessonInstructor {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user: DtoUser;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: DtoDriversLicenseCategory,
  })
  instructorsQualifications: DtoDriversLicenseCategory[];

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null | undefined;
}

export class DtoFindOneInstructor {
  @ApiProperty()
  @ValidateNested()
  user: DtoCreateUser;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  instructorsQualifications: DtoDriversLicenseCategory[];

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null;
}

export class DtoCreateInstructor {
  @ApiProperty()
  @ValidateNested()
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

export class DtoUpdateInstructor {
  @ApiProperty()
  @ValidateNested()
  user: Partial<DtoUpdateUser>;

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
  photo: string | null | undefined;
}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoFindOneInstructor,
  })
  @ValidateNested({ each: true })
  instructors: DtoFindOneInstructor[];
}

export class InstructorFindOneResponseDto {
  @ValidateNested()
  @ApiProperty()
  instructor: DtoFindOneInstructor;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
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
  instructor: DtoCreateInstructor;
}

export class InstructorCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
