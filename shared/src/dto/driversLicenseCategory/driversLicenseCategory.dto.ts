import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class DtoDriversLicenseCategory {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class DriversLicenseCategoryFindAllResponseDto {
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: DtoDriversLicenseCategory,
  })
  categories: DtoDriversLicenseCategory[];
}

export class DriversLicenseCategoryUpdateRequestDto {
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: 'DtoDriversLicenseCategory',
  })
  categories: DtoDriversLicenseCategory[];
}
