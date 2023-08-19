import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty()
  id: number;
}
