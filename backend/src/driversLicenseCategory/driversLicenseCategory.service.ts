import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DriversLicenseCategory } from './entities/driversLicenseCategory.entity';

@Injectable()
export class DriversLicenseCategoriesService {
  constructor(
    @InjectRepository(DriversLicenseCategory)
    private driversLicenseCategoryRepository: Repository<DriversLicenseCategory>,
  ) {}

  findAll() {
    return this.driversLicenseCategoryRepository.find();
  }

  findCategoriesById(ids: number[]) {
    return this.driversLicenseCategoryRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
