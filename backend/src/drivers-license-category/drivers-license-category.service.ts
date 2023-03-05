import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { getFailure, getSuccess, Try } from '../types/Try';
import { DriversLicenseCategory } from './entities/drivers-license-category.entity';

interface DriversLicenseCategoryResponseData {
  id: number;
  name: string;
  reports: Report[];
}

@Injectable()
export class DriversLicenseCategoriesService {
  constructor(
    @InjectRepository(DriversLicenseCategory)
    private driversLicenseCategoryRepository: Repository<DriversLicenseCategory>,
  ) {}

  findAll() {
    return this.driversLicenseCategoryRepository.find();
  }

  findOneCategoryById(id: number) {
    return this.driversLicenseCategoryRepository.findOneBy({ id });
  }

  findCategoriesById(ids: number[]) {
    return this.driversLicenseCategoryRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findByCategoryName(
    categoryName: string,
  ): Promise<
    Try<DriversLicenseCategoryResponseData, 'DRIVER_LICENSE_CATEGORY_NOT_FOUND'>
  > {
    const category = await this.driversLicenseCategoryRepository.findOne({
      where: {
        name: categoryName,
      },
    });

    if (category === null) {
      return getFailure('DRIVER_LICENSE_CATEGORY_NOT_FOUND');
    }

    return getSuccess(category);
  }
}
