import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntry } from './entities/report-entry.entity';

@Injectable()
export class ReportEntriesService {
  constructor(
    @InjectRepository(ReportEntry)
    private reportEntriesRepository: Repository<ReportEntry>,
  ) {}

  async getReportEntries(reportId: number) {
    const reportEntries = await this.reportEntriesRepository.find({
      where: {
        report: { id: reportId },
      },
    });

    return reportEntries;
  }
}
