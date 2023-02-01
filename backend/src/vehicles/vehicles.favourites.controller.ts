import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  UserRole,
  VehicleAddFavouriteRequestDto,
  VehicleAddFavouriteResponseDto,
  VehicleGetMyFavouritesResponseDto,
  VehicleRemoveFavouriteRequestDto,
  VehicleRemoveFavouriteResponseDto,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { CurrentUserService } from '../current-user/current-user.service';
import { InstructorsService } from '../instructors/instructors.service';
import { VehicleService } from './vehicles.service';

@Controller('vehicles/favourites')
@Roles(UserRole.Instructor)
export class VehiclesFavouritesController {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly vehiclesService: VehicleService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @ApiResponse({ type: VehicleGetMyFavouritesResponseDto })
  @Get('my')
  async myFavourites(): Promise<VehicleGetMyFavouritesResponseDto> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const vehiclesResult = await this.instructorsService.getFavouritesByUserId(
      userId,
    );

    if (!vehiclesResult.ok) {
      throw new NotFoundException();
    }

    const vehicles = vehiclesResult.data;

    return { vehicles };
  }

  @ApiResponse({ type: VehicleAddFavouriteResponseDto })
  @Post()
  async addFavourite(
    @Body() { vehicleId }: VehicleAddFavouriteRequestDto,
  ): Promise<VehicleAddFavouriteResponseDto> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const vehicleResult = await this.vehiclesService.findOneById(vehicleId);

    if (!vehicleResult.ok) {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }

    const vehicle = vehicleResult.data;
    await this.instructorsService.addFavourite(userId, vehicle);

    return {};
  }

  @ApiResponse({ type: VehicleRemoveFavouriteResponseDto })
  @Delete()
  async removeFavourite(
    @Body() { vehicleId }: VehicleRemoveFavouriteRequestDto,
  ): Promise<VehicleRemoveFavouriteResponseDto> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const vehicleResult = await this.vehiclesService.findOneById(vehicleId);

    if (!vehicleResult.ok) {
      throw new NotFoundException('Vehicle with this id does not exist.');
    }

    const vehicle = vehicleResult.data;
    await this.instructorsService.removeFavourite(userId, vehicle);

    return {};
  }
}
