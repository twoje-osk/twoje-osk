import { Module } from '@nestjs/common';
import { ReportEntriesService } from './report-entries.service';
import { ReportEntriesController } from './report-entries.controller';

@Module({
  controllers: [ReportEntriesController],
  providers: [ReportEntriesService],
})
export class ReportEntriesModule {}
