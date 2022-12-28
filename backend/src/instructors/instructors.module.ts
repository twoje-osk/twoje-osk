import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversLicenseCategoriesModule } from '../driversLicenseCategory/driversLicenseCategory.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Instructor } from './entities/instructor.entity';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';

@Module({
  controllers: [InstructorsController],
  imports: [
    TypeOrmModule.forFeature([Instructor, User]),
    UsersModule,
    DriversLicenseCategoriesModule,
  ],
  exports: [InstructorsService],
  providers: [InstructorsService],
})
export class InstructorsModule {}
