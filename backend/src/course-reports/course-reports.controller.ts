import { Controller } from '@nestjs/common';
import { CourseReportsService } from './course-reports.service';

@Controller('course-reports')
export class CourseReportsController {
  constructor(private readonly courseReportsService: CourseReportsService) {}
}
