import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { OrganizationDto } from '../organization/organization.dto';
import { UserRole } from '../../types/user.types';
import type { TraineeDto } from '../trainee/trainee.dto';
import type { InstructorDto } from '../instructor/instructor.dto';

export class UserDto {
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
  organization: OrganizationDto;

  @ApiProperty({ enum: UserRole })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ nullable: true })
  @IsOptional()
  trainee: TraineeDto | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  instructor: InstructorDto | null;
}
export class CreateUserDto {
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

export class CreateUserSignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 64)
  @IsOptional()
  password: string | undefined;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserAddNewResponseDto {
  @ApiProperty()
  @Type(() => CreateUserDto)
  user: UserDto;
}

export class UserAddNewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: CreateUserDto;
}

export class UserFindOneResponseDto {
  @ApiProperty()
  user: UserDto;
}

export class UserUpdateResponseDto {}

export class UserUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  user: UpdateUserDto;
}

export class UserDisableResponseDto {}

export class UserDisableRequestDto {}
export class UserMyProfileResponseDto {
  @ApiProperty()
  user: UserDto;
}
