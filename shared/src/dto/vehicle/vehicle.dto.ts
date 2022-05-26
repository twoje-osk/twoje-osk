import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class DtoVehicle {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  notes?: string;
}

export class DtoCreateVehicle {
  @ApiProperty()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ nullable: true })
  notes?: string;
}
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
  vehicle: DtoCreateVehicle;
}
