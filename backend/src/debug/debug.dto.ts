import { ApiProperty } from '@nestjs/swagger';

export class GetHostNameResponseDto {
  @ApiProperty()
  public hostname: string;
}
