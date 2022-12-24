import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversLicenseCategoriesController } from './drivers-license-category.controller';
import { DriversLicenseCategoriesService } from './drivers-license-category.service';
import { DriversLicenseCategory } from './entities/drivers-license-category.entity';

@Module({
  controllers: [DriversLicenseCategoriesController],
  imports: [TypeOrmModule.forFeature([DriversLicenseCategory])],
  exports: [DriversLicenseCategoriesService],
  providers: [DriversLicenseCategoriesService],
})
export class DriversLicenseCategoriesModule {}
