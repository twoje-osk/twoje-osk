import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DriversLicenseCategoryFindAllResponseDto } from '@osk/shared';
import { DriversLicenseCategoriesService } from './drivers-license-category.service';

@Controller('drivers-license-categories')
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
