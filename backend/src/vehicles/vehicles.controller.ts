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
  BadRequestException,
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
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { VehicleService } from './vehicles.service';

@Controller('vehicles')
@Roles(UserRole.Admin, UserRole.Instructor)
export class VehiclesController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiResponse({
    type: VehicleGetAllResponseDto,
  })
  @Get()
  async findAll(): Promise<VehicleGetAllResponseDto> {
    return { vehicles: await this.vehicleService.findAll() };
  }

  @ApiResponse({
    type: VehicleFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleFindOneResponseDto> {
    try {
      return { vehicle: await this.vehicleService.findOneById(id) };
    } catch (error) {
      if (error instanceof Error && error.message === 'VEHICLE_NOT_FOUND') {
        throw new NotFoundException('Vehicle with this id does not exist.');
      }
      throw error;
    }
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
    try {
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'VEHICLE_SAME_LICENSE_PLATE'
      ) {
        throw new ConflictException(
          'Vehicle with this license plate already exists.',
        );
      }
      throw error;
    }
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
    try {
      return await this.vehicleService.update(vehicle, id);
    } catch (error) {
      if (error instanceof Error && error.message === 'VEHICLE_NOT_FOUND') {
        throw new NotFoundException('Vehicle with this id does not exist.');
      }
      if (
        error instanceof Error &&
        error.message === 'VEHICLE_SAME_LICENSE_PLATE'
      ) {
        throw new ConflictException(
          'Vehicle with this license plate already exists.',
        );
      }
      if (
        error instanceof Error &&
        error.message === 'VIN_LENGTH_NOT_CORRECT'
      ) {
        throw new BadRequestException(
          `Provided VIN is not 17 chars long. Provided length: ${vehicle.licensePlate}`,
        );
      }
      throw error;
    }
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
