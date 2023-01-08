import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class DriversLicenseCategoryDto {
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
    type: DriversLicenseCategoryDto,
  })
  categories: DriversLicenseCategoryDto[];
}

export class DriversLicenseCategoryUpdateRequestDto {
  @ValidateNested({ each: true })
  @ApiProperty({
    isArray: true,
    type: 'DriversLicenseCategoryDto',
  })
  categories: DriversLicenseCategoryDto[];
}
