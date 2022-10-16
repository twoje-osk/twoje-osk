import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversLicenseCategoriesController } from './driversLicenseCategory.controller';
import { DriversLicenseCategoriesService } from './driversLicenseCategory.service';
import { DriversLicenseCategory } from './entities/driversLicenseCategory.entity';

@Module({
  controllers: [DriversLicenseCategoriesController],
  imports: [TypeOrmModule.forFeature([DriversLicenseCategory])],
  exports: [DriversLicenseCategoriesService],
  providers: [DriversLicenseCategoriesService],
})
export class DriversLicenseCategoriesModule {}
