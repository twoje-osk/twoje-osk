import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAuthRequestDto {
  @ApiProperty({ default: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginAuthResponseDto {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

export class ForgotPasswordRequestDto {
  @ApiProperty({ default: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordResponseDto {}

export class ResetPasswordRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ default: 'password123' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string;
}

export class ResetPasswordResponseDto {}
