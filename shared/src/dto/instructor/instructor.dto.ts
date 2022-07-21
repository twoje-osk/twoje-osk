import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DtoDriversLicenseCategory } from '../driversLicenseCategory/driversLicenseCategory.dto';
import { DtoCreateUser, DtoUpdateUser, DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user: DtoUser;

  @ApiProperty()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  instructorsQualifications: number[];

  @ApiProperty({ nullable: true })
  photo: string | null | undefined;
}

export class DtoLessonInstructor {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user: DtoUser;

  @ApiProperty()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({
    isArray: true,
    type: DtoDriversLicenseCategory,
  })
  instructorsQualifications: DtoDriversLicenseCategory[];

  @ApiProperty({ nullable: true })
  photo: string | null | undefined;
}

export class DtoFindOneInstructor {
  @ApiProperty()
  user: DtoCreateUser;

  @ApiProperty()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  instructorsQualifications: DtoDriversLicenseCategory[];

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoCreateInstructor {
  @ApiProperty()
  user: DtoCreateUser;

  @ApiProperty()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  instructorsQualifications: number[];

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoUpdateInstructor {
  @ApiProperty()
  user: Partial<DtoUpdateUser>;

  @ApiProperty()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  instructorsQualifications: number[];

  @ApiProperty({ nullable: true })
  photo: string | null | undefined;
}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoFindOneInstructor,
  })
  instructors: DtoFindOneInstructor[];
}

export class InstructorFindOneResponseDto {
  @ApiProperty()
  instructor: DtoFindOneInstructor;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoUpdateInstructor;
}

export class InstructorUpdateResponseDto {
  @ApiProperty()
  id: number;
}

export class InstructorCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoCreateInstructor;
}

export class InstructorCreateResponseDto {
  @ApiProperty()
  id: number;
}
