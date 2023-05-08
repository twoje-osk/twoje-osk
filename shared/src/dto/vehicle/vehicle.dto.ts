import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsString,
  ValidateNested,
  IsIn,
  IsPositive,
  IsInt,
  Min,
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

export class VehicleFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: VehicleDto,
  })
  vehicles: VehicleDto[];

  @ApiProperty()
  total: number;
}

export class VehicleFindOneResponseDto {
  @ApiProperty()
  vehicle: VehicleDto;
}

export class VehicleFindAllQueryDtoFilters {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfNextCheck?: ApiDate;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  additionalDetails?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

const vehicleFindAllQueryDtoSortByOptions = [
  'name',
  'licensePlate',
  'vin',
  'dateOfNextCheck',
  'additionalDetails',
  'notes',
] as const;
const vehicleFindAllQueryDtoSortOrderOptions = ['asc', 'desc'] as const;

export class VehicleFindAllQueryDto {
  @ApiProperty({ required: false, enum: vehicleFindAllQueryDtoSortByOptions })
  @IsOptional()
  @IsIn(vehicleFindAllQueryDtoSortByOptions)
  sortBy?: typeof vehicleFindAllQueryDtoSortByOptions[number];

  @ApiProperty({
    required: false,
    enum: vehicleFindAllQueryDtoSortOrderOptions,
  })
  @IsOptional()
  @IsIn(vehicleFindAllQueryDtoSortOrderOptions)
  sortOrder?: typeof vehicleFindAllQueryDtoSortOrderOptions[number];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleFindAllQueryDtoFilters)
  filters?: VehicleFindAllQueryDtoFilters;
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
