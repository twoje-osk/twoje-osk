import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReportEntryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
