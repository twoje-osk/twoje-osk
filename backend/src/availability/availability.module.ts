import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Availability } from './entities/availability.entity';
import { InstructorsModule } from '../instructors/instructors.module';
// eslint-disable-next-line import/no-cycle
import { LessonsModule } from '../lessons/lessons.module';

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
