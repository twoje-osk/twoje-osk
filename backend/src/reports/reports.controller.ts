import { Controller } from '@nestjs/common';
import { UserRole } from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { ReportsService } from './reports.service';

@Roles(UserRole.Admin)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
}
