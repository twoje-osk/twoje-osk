import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { User } from 'users/entities/user.entity';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [TypeOrmModule.forFeature([Trainee, User]), UsersModule],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
