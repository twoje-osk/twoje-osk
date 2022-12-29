import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async getReportByDriversLicenseCategoryId(driversLicenseCategoryId: number) {
    const reports = await this.reportsRepository.find({
      where: {
        driversLicenseCategory: {
          id: driversLicenseCategoryId,
        },
      },
    });

    return reports; // .map((v)=> new Date(v.));
  }

  async getReportsByDriversLicenseCategoryId(driversLicenseCategoryId: number) {
    const reports = await this.reportsRepository.find({
      where: {
        driversLicenseCategory: {
          id: driversLicenseCategoryId,
        },
      },
    });

    return reports;
  }
}
