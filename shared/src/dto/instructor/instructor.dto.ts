import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoCreateInstructor {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoUpdateInstructor extends PartialType(DtoCreateInstructor) {}

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

export class InstructorAddNewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoCreateInstructor;
}

export class InstructorAddNewResponseDto {
  @ApiProperty()
  @ValidateNested()
  instructor: DtoInstructor;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoUpdateInstructor;
}

export class InstructorUpdateResponseDto {}
