import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsModule } from 'lessons/lessons.module';
import { InstructorsModule } from 'instructors/instructors.module';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Availability } from './entities/availability.entity';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  imports: [
    TypeOrmModule.forFeature([Availability]),
    forwardRef(() => LessonsModule),
    InstructorsModule,
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
