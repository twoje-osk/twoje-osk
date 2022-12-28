import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  DriversLicenseCategoryFindAllResponseDto,
  UserRole,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { DriversLicenseCategoriesService } from './driversLicenseCategory.service';

@Controller('drivers-license-categories')
@Roles(UserRole.Admin)
export class DriversLicenseCategoriesController {
  constructor(
    private readonly driversLicenseCategoriesService: DriversLicenseCategoriesService,
  ) {}

  @ApiResponse({
    type: DriversLicenseCategoryFindAllResponseDto,
  })
  @Get()
  async findAll(): Promise<DriversLicenseCategoryFindAllResponseDto> {
    const categories = await this.driversLicenseCategoriesService.findAll();
    return { categories };
  }
}
