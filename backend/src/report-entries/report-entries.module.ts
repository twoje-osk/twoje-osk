import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntry } from './entities/report-entry.entity';
import { ReportEntriesService } from './report-entries.service';

@Module({
  exports: [ReportEntriesService],
  imports: [TypeOrmModule.forFeature([ReportEntry])],
  providers: [ReportEntriesService],
})
export class ReportEntriesModule {}
