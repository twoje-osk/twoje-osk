import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { ReportsService } from './reports.service';

@Roles(UserRole.Admin)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiResponse({ type: '' })
  @Get(':driverLicenseId')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getReport(
    @Param('driverLicenseId', ParseIntPipe) driverLicenseId: number,
  ) {
    const report = await this.reportsService.findOneByDriversLicenseCategoryId(
      driverLicenseId,
    );
    return { report };
  }
}
