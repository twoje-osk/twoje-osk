import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';

@Module({
  exports: [ReportsService],
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService],
})
export class ReportsModule {}
