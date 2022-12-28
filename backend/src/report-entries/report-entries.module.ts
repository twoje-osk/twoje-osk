import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntry } from './entities/report-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntry])],
})
export class ReportEntriesModule {}
