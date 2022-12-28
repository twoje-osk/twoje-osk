import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { InstructorLessonsController } from './lessons.controller.instructor';
import { TraineeLessonsController } from './lessons.controller.trainee';
import { Lesson } from './entities/lesson.entity';
// eslint-disable-next-line import/no-cycle
import { AvailabilityModule } from '../availability/availability.module';
import { InstructorsModule } from '../instructors/instructors.module';
import { TraineesModule } from '../trainees/trainees.module';

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
