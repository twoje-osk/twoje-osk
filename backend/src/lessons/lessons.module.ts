import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorsModule } from 'instructors/instructors.module';
import { AvailabilityModule } from 'availability/availability.module';
import { TraineesModule } from 'trainees/trainees.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';

@Module({
  controllers: [LessonsController],
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
