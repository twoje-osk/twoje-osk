import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { User } from 'users/entities/user.entity';
import { ResetPasswordModule } from 'reset-password/reset-password.module';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';

@Module({
  controllers: [TraineesController],
  imports: [
    TypeOrmModule.forFeature([Trainee, User]),
    forwardRef(() => UsersModule),
    ResetPasswordModule,
  ],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
