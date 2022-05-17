import { ApiProperty } from '@nestjs/swagger';

export class DtoOrganization {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
