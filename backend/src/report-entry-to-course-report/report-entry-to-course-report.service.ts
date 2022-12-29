import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntryToCourseReport } from './entities/report-entry-to-course-report.entity';

@Injectable()
export class ReportEntryToCourseReportService {
  constructor(
    @InjectRepository(ReportEntryToCourseReport)
    private reportEntryToCourseReportsRepository: Repository<ReportEntryToCourseReport>,
  ) {}

  // async generateTraineeReportEntries()

  // async editTraineeReportEntry(traineeReportId: number, )
}
