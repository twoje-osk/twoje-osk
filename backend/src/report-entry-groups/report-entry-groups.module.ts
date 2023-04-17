import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntryGroupsService } from './report-entry-groups.service';
import { ReportEntryGroup } from './entities/report-entry-groups.entity';

@Module({
  exports: [ReportEntryGroupsService],
  imports: [TypeOrmModule.forFeature([ReportEntryGroup])],
  providers: [ReportEntryGroupsService],
})
export class ReportEntryGroupsModule {}
