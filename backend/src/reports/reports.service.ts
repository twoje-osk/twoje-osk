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

  async findOneByDriversLicenseCategoryId(driversLicenseCategoryId: number) {
    const report = await this.reportsRepository.findOne({
      where: {
        driversLicenseCategory: {
          id: driversLicenseCategoryId,
        },
      },
      relations: {
        courseReports: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return report;
  }
}
