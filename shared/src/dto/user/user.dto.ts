import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { DtoOrganization } from '../organization/organization.dto';
import { UserRole } from '../../types/user.types';
import type { DtoTrainee } from '../trainee/trainee.dto';
import type { DtoInstructor } from '../instructor/instructor.dto';

export class DtoUser {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  @IsNotEmpty()
  createdAt: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  organization: DtoOrganization;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @Length(8, 64)
  trainee: DtoTrainee | null;

  @ApiProperty()
  instructor: DtoInstructor | null;
}
export class DtoCreateUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class DtoCreateUserSignup {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class DtoUpdateUser extends PartialType(DtoCreateUser) {}

export class UserAddNewResponseDto {
  @ApiProperty()
  @Type(() => DtoCreateUser)
  user: DtoUser;
}

export class UserAddNewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: DtoCreateUser;
}

export class UserFindOneResponseDto {
  @ApiProperty()
  user: DtoUser;
}

export class UserUpdateResponseDto {}

export class UserUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: DtoUpdateUser;
}

export class UserDisableResponseDto {}

export class UserDisableRequestDto {}
export class UserMyProfileResponseDto {
  @ApiProperty()
  user: DtoUser;
}
