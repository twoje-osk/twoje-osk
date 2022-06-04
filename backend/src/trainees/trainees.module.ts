import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [TypeOrmModule.forFeature([Trainee])],
  providers: [TraineesService, CurrentUserService],
})
export class TraineesModule {}
