import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  ConflictException,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import {
  VehicleFindOneResponseDto,
  VehicleGetAllResponseDto,
  VehicleAddNewResponseDto,
  VehicleAddNewRequestDto,
  VehicleUpdateRequestDto,
  VehicleUpdateResponseDto,
  VehicleDeleteResponseDto,
  VehicleDeleteRequestDto,
} from '@osk/shared';
import { VehicleService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiResponse({
    type: VehicleGetAllResponseDto,
  })
  @Get()
  async findAll(): Promise<VehicleGetAllResponseDto> {
    const vehicles = await this.vehicleService.findAll();

    return { vehicles };
  }

  @ApiResponse({
    type: VehicleFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleFindOneResponseDto> {
    const vehicle = await this.vehicleService.findOneById(id);

    if (vehicle === null) {
      throw new NotFoundException();
    }

    return { vehicle };
  }

  @ApiCreatedResponse({
    type: VehicleAddNewResponseDto,
    description: 'Record created',
  })
  @ApiBody({ type: VehicleAddNewRequestDto })
  @Post()
  async create(
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
      vehicle: await this.vehicleService.create(
        vehicle.name,
        vehicle.licensePlate,
        vehicle.vin,
        vehicle.dateOfNextCheck,
        vehicle.photo,
        vehicle.additionalDetails,
        vehicle.notes,
      ),
    };
  }

  @ApiResponse({
    type: VehicleUpdateResponseDto,
  })
  @ApiBody({ type: VehicleUpdateRequestDto })
  @Patch(':id')
  async update(
    @Body() { vehicle }: VehicleUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleUpdateResponseDto> {
    const doesVehicleExist =
      (await this.vehicleService.findOneById(id)) !== null;

    if (!doesVehicleExist) {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }

    if (vehicle.licensePlate !== undefined) {
      const alreadyExistingVehicle =
        await this.vehicleService.findOneByLicensePlate(vehicle.licensePlate);
      if (
        alreadyExistingVehicle !== undefined &&
        alreadyExistingVehicle?.id !== id
      ) {
        throw new ConflictException(
          'Vehicle with this license plate already exists.',
        );
      }
    }

    await this.vehicleService.update(vehicle, id);

    return {};
  }

  @ApiResponse({
    type: VehicleDeleteResponseDto,
  })
  @ApiBody({ type: VehicleDeleteRequestDto })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleDeleteResponseDto> {
    const doesVehicleExist =
      (await this.vehicleService.findOneById(id)) !== null;

    if (!doesVehicleExist) {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }

    await this.vehicleService.remove(id);

    return {};
  }
}
