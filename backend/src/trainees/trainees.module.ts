import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { CurrentUserModule } from 'current-user/current-user.module';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [TypeOrmModule.forFeature([Trainee]), CurrentUserModule],
  providers: [TraineesService, CurrentUserService],
})
export class TraineesModule {}
