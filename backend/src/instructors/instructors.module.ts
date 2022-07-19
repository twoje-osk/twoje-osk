import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';

@Module({
  controllers: [InstructorsController],
  imports: [TypeOrmModule.forFeature([Instructor])],
  providers: [InstructorsService],
  exports: [InstructorsService],
})
export class InstructorsModule {}
