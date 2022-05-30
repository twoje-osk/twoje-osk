import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Type } from 'class-transformer';

export class DtoVehicle {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  notes: string | null;
}

export class DtoCreateVehicle {
  @ApiProperty()
  @IsNotEmpty()
  licensePlate: string;

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
  @ValidateNested()
  @Type(() => DtoCreateVehicle)
  vehicle: DtoVehicle;
}

export class VehicleAddNewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  vehicle: DtoCreateVehicle;
}

export class VehicleUpdateResponseDto {}

export class VehicleUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  vehicle: DtoUpdateVehicle;
}

export class VehicleDeleteResponseDto {}

export class VehicleDeleteRequestDto {}
