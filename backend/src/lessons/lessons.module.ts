import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorsModule } from 'instructors/instructors.module';
import { AvailabilityModule } from 'availability/availability.module';
import { TraineesModule } from 'trainees/trainees.module';
import { LessonsService } from './lessons.service';
import { InstructorLessonsController } from './lessons.controller.instructor';
import { TraineeLessonsController } from './lessons.controller.trainee';
import { Lesson } from './entities/lesson.entity';

@Module({
  controllers: [InstructorLessonsController, TraineeLessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    InstructorsModule,
    forwardRef(() => AvailabilityModule),
    TraineesModule,
  ],
})
export class LessonsModule {}
