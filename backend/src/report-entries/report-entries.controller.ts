import { Controller } from '@nestjs/common';
import { ReportEntriesService } from './report-entries.service';

@Controller('report-entries')
export class ReportEntriesController {
  constructor(private readonly reportEntriesService: ReportEntriesService) {}
}
