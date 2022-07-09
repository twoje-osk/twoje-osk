import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [TypeOrmModule.forFeature([Trainee]), DataSource],
  providers: [TraineesService],
})
export class TraineesModule {}
