import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  VehicleFindOneResponseDto,
  VehicleGetAllResponseDto,
} from '@osk/shared';
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

  @ApiResponse({
    type: VehicleFindOneResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VehicleFindOneResponseDto> {
    const vehicle = await this.vehicleService.findOne(+id);

    if (vehicle === null) {
      throw new NotFoundException();
    }

    return { vehicle };
  }
}
