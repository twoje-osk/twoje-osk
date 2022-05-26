import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  ConflictException,
} from '@nestjs/common';
import { ApiResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import {
  VehicleFindOneResponseDto,
  VehicleGetAllResponseDto,
  VehicleAddNewResponseDto,
  VehicleAddNewRequestDto,
} from '@osk/shared';
import { Vehicle } from './entities/vehicle.entity';
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

  // eslint-disable-next-line require-decorator/require-decorator
  @ApiCreatedResponse({ type: Vehicle, description: 'Record created' })
  @ApiBody({ type: VehicleAddNewRequestDto })
  @Post()
  async addNew(
    @Body() { vehicle }: VehicleAddNewRequestDto,
  ): Promise<VehicleAddNewResponseDto> {
    const doesVehicleExist =
      await this.vehicleService.checkIfExistsByLicensePlate(
        vehicle.licensePlate,
      );

    if (doesVehicleExist) {
      throw new ConflictException(
        'Vehicle with this license plate already exists.',
      );
    }

    return {
      vehicle: await this.vehicleService.addNew(
        vehicle.licensePlate,
        vehicle.notes,
      ),
    };
  }
}
