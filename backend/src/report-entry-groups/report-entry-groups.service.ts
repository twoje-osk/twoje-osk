import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntryGroup } from './entities/report-entry-groups.entity';

@Injectable()
export class ReportEntryGroupsService {
  constructor(
    @InjectRepository(ReportEntryGroup)
    private reportEntryGroupsRepository: Repository<ReportEntryGroup>,
  ) {}

  async findById(id: number) {
    const reportEntries = await this.reportEntryGroupsRepository.find({
      where: {
        id,
      },
    });

    return reportEntries;
  }
}
