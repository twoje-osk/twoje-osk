import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriversLicenseCategory } from './entities/driversLicenseCategory.entity';

@Injectable()
export class DriversLicenseCategoriesService {
  constructor(
    @InjectRepository(DriversLicenseCategory)
    private driversLicenseCategoryRepository: Repository<DriversLicenseCategory>,
  ) {}

  async findAll() {
    const categories = await this.driversLicenseCategoryRepository.find();

    return categories;
  }
}
