import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

@Module({
  exports: [ReportsService],
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService],
})
export class ReportsModule {}
