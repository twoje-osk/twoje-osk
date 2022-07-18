import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DtoVehicle {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  dateOfNextCheck: ApiDate;

  @ApiProperty({ nullable: true })
  @IsOptional()
  photo: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  additionalDetails: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  notes: string | null;
}

export class DtoCreateVehicle {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  dateOfNextCheck: ApiDate;

  @ApiProperty({ nullable: true })
  photo: string | null;

  @ApiProperty({ nullable: true })
  additionalDetails: string | null;

  @ApiProperty({ nullable: true })
  notes: string | null;
}

export class DtoUpdateVehicle extends PartialType(DtoCreateVehicle) {}

export class VehicleGetAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoVehicle,
  })
  vehicles: DtoVehicle[];
}

export class VehicleFindOneResponseDto {
  @ApiProperty()
  vehicle: DtoVehicle;
}

export class VehicleAddNewResponseDto {
  @ApiProperty()
  vehicle: DtoVehicle;
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

export class VehicleDeleteRequestDto {}
