import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UserTestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  a: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  b: number;
}
