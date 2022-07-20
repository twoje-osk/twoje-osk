import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { DtoOrganization } from '../organization/organization.dto';
import { UserRole } from '../../types/user.types';

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
  password: string;

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
  })
  @IsNotEmpty()
  createdAt: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  organization: DtoOrganization;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
export class DtoCreateUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

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

export class DtoUpdateUser extends OmitType(PartialType(DtoCreateUser), [
  'password',
]) {}

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
