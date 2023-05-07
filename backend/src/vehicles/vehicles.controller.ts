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
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import {
  VehicleFindOneResponseDto,
  VehicleFindAllResponseDto,
  VehicleAddNewResponseDto,
  VehicleAddNewRequestDto,
  VehicleUpdateRequestDto,
  VehicleUpdateResponseDto,
  VehicleDeleteResponseDto,
  UserRole,
  VehicleFindAllQueryDto,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { assertNever } from '../utils/assertNever';
import { VehicleService } from './vehicles.service';

@Controller('vehicles')
@Roles(UserRole.Admin, UserRole.Instructor)
export class VehiclesController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiResponse({
    type: VehicleFindAllResponseDto,
  })
  @Get()
  async findAll(
    @Query() query: VehicleFindAllQueryDto,
  ): Promise<VehicleFindAllResponseDto> {
    const { vehicles, count } = await this.vehicleService.findAll({
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
      sort: {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      filter: query.filters ?? {},
    });
    return { vehicles, total: count };
  }

  @ApiResponse({
    type: VehicleFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleFindOneResponseDto> {
    const findVehicleCall = await this.vehicleService.findOneById(id);

    if (findVehicleCall.ok) {
      return { vehicle: findVehicleCall.data };
    }

    const { error } = findVehicleCall;

    if (error === 'VEHICLE_NOT_FOUND') {
      throw new ConflictException('Vehicle with this id does not exist.');
    }
    return assertNever(error);
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
    const createVehicleCall = await this.vehicleService.create(
      vehicle.name,
      vehicle.licensePlate,
      vehicle.vin,
      vehicle.dateOfNextCheck,
      vehicle.photo,
      vehicle.additionalDetails,
      vehicle.notes,
    );

    if (createVehicleCall.ok) {
      return { vehicle: createVehicleCall.data };
    }

    const { error } = createVehicleCall;

    if (error === 'VEHICLE_SAME_LICENSE_PLATE') {
      throw new ConflictException(
        'Vehicle with this license plate already exists.',
      );
    }
    return assertNever(error);
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
    const updateVehicleCall = await this.vehicleService.update(vehicle, id);
    if (updateVehicleCall.ok) {
      return {
        vehicle: updateVehicleCall.data,
      };
    }
    const { error } = updateVehicleCall;
    if (error === 'VEHICLE_NOT_FOUND') {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }
    if (error === 'VEHICLE_SAME_LICENSE_PLATE') {
      throw new ConflictException(
        'Vehicle with this license plate already exists.',
      );
    }
    return assertNever(error);
  }

  @ApiResponse({
    type: VehicleDeleteResponseDto,
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleDeleteResponseDto> {
    const deleteVehicleCall = await this.vehicleService.remove(id);

    if (deleteVehicleCall.ok) {
      return { vehicle: deleteVehicleCall.data };
    }

    const { error } = deleteVehicleCall;

    if (error === 'VEHICLE_NOT_FOUND') {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }

    return assertNever(error);
  }
}
