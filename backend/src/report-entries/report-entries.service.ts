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

  async getEntriesByReportId(reportEntryId: number) {
    const reportEntries = await this.reportEntriesRepository.find({
      where: {
        report: { id: reportEntryId },
      },
    });

    return reportEntries;
  }
}
