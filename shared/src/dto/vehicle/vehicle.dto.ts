import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class VehicleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  licensePlate: string;

  @ApiProperty()
  @MinLength(17, {
    message: 'Vin is too short. 17 chars required.',
  })
  @MaxLength(17, {
    message: 'Vin is too long. 17 chars required.',
  })
  @IsNotEmpty()
  vin: string;

  @ApiProperty()
  dateOfNextCheck: ApiDate;

  @ApiProperty({ nullable: true })
  photo: string | null;

  @ApiProperty({ nullable: true })
  additionalDetails: string | null;

  @ApiProperty({ nullable: true })
  notes: string | null;
}

export class DtoCreateVehicle {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @ApiProperty()
  @MinLength(17, {
    message: 'Vin is too short. 17 chars required.',
  })
  @MaxLength(17, {
    message: 'Vin is too long. 17 chars required.',
  })
  @IsNotEmpty()
  @IsString()
  vin: string;

  @ApiProperty({ type: 'string', format: 'YYYY-mm-DDTHH:mm:ss.SZ' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfNextCheck: ApiDate;

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  photo: string | null;

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  additionalDetails: string | null;

  @ApiPropertyOptional({ nullable: true, type: 'string' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? null)
  notes: string | null;
}

export class DtoUpdateVehicle extends PartialType(DtoCreateVehicle) {}

export class VehicleGetAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: VehicleDto,
  })
  vehicles: VehicleDto[];
}

export class VehicleFindOneResponseDto {
  @ApiProperty()
  vehicle: VehicleDto;
}

export class VehicleAddNewResponseDto {
  @ApiProperty()
  vehicle: VehicleDto;
}

export class VehicleAddNewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoCreateVehicle)
  vehicle: DtoCreateVehicle;
}

export class VehicleUpdateResponseDto {}

export class VehicleUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoUpdateVehicle)
  vehicle: DtoUpdateVehicle;
}

export class VehicleDeleteResponseDto {}

export class VehicleGetMyFavouritesResponseDto {
  @ApiProperty({
    isArray: true,
    type: VehicleDto,
  })
  vehicles: number[];
}

export class VehicleAddFavouriteRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;
}
export class VehicleAddFavouriteResponseDto {}

export class VehicleRemoveFavouriteRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;
}
export class VehicleRemoveFavouriteResponseDto {}
