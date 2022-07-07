import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { Instructor } from './entities/instructor.entity';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';

@Module({
  controllers: [InstructorsController],
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [InstructorsService],
  providers: [InstructorsService, UsersService],
})
export class InstructorsModule {}
