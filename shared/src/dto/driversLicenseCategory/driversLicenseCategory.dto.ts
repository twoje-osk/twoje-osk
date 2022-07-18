import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DtoDriversLicenseCategory {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class DriversLicenseCategoryFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoDriversLicenseCategory,
  })
  categories: DtoDriversLicenseCategory[];
}

export class DriversLicenseCategoryUpdateRequestDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  categories: DtoDriversLicenseCategory[];
}
