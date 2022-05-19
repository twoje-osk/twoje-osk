import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { VehicleGetAllResponseDto } from '@osk/shared';
import { VehicleService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiResponse({
    type: VehicleGetAllResponseDto,
  })
  @Get()
  async getAll(): Promise<VehicleGetAllResponseDto> {
    const vehicles = await this.vehicleService.getAll();

    return { vehicles };
  }
}
