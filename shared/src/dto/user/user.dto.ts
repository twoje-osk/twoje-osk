import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UserTestDto {
  @IsString()
  @IsNotEmpty()
  a: string;

  @IsNumberString()
  @IsNotEmpty()
  b: number;
}
