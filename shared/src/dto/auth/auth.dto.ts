import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  @ApiProperty({ default: '83c39cf95ef7e5179344c2d4721d5c96' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ default: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordResponseDto {}
