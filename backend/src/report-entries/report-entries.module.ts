import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntriesService } from './report-entries.service';
import { ReportEntriesController } from './report-entries.controller';
import { ReportEntry } from './entities/report-entry.entity';

@Module({
  exports: [ReportEntriesService],
  controllers: [ReportEntriesController],
  imports: [TypeOrmModule.forFeature([ReportEntry])],
  providers: [ReportEntriesService],
})
export class ReportEntriesModule {}
