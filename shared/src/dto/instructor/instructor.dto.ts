import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DriversLicenseCategoryUpdateRequestDto } from 'dto/driversLicenseCategory/driversLicenseCategory.dto';
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
  instructorsQualifications: DriversLicenseCategoryUpdateRequestDto[];

  @ApiProperty({ nullable: true })
  photo: string | null | undefined;
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
  instructorsQualifications: DriversLicenseCategoryUpdateRequestDto[];

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
  instructorsQualifications: DriversLicenseCategoryUpdateRequestDto[];

  @ApiProperty({ nullable: true })
  photo: string | null | undefined;
}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoInstructor,
  })
  instructors: DtoInstructor[];
}

export class InstructorFindOneResponseDto {
  @ApiProperty()
  instructor: DtoInstructor;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoUpdateInstructor;
}

export class InstructorUpdateResponseDto {
  @ApiProperty()
  instructor: DtoInstructor;
}

export class InstructorCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoCreateInstructor;
}

export class InstructorCreateResponseDto {
  @ApiProperty()
  instructor: DtoInstructor;
}
