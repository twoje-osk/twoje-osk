import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';
import { CepikModule } from '../cepik/cepik.module';
import { ResetPasswordModule } from '../reset-password/reset-password.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { DriversLicenseCategoriesModule } from '../drivers-license-category/drivers-license-category.module';
import { CourseReportsModule } from '../course-reports/course-reports.module';

@Module({
  controllers: [TraineesController],
  imports: [
    TypeOrmModule.forFeature([Trainee, User]),
    UsersModule,
    ResetPasswordModule,
    CepikModule,
    DriversLicenseCategoriesModule,
    CourseReportsModule,
  ],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
