import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DtoOrganization } from '../organization/organization.dto';

export class DtoVehicle {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ nullable: true })
  notes?: string;

  @ApiProperty()
  organization: DtoOrganization;
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
