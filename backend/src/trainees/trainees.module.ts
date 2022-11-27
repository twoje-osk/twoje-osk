import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { User } from 'users/entities/user.entity';
import { ResetPasswordModule } from 'reset-password/reset-password.module';
import { CepikModule } from 'cepik/cepik.module';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [
    TypeOrmModule.forFeature([Trainee, User]),
    UsersModule,
    ResetPasswordModule,
    CepikModule,
  ],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
