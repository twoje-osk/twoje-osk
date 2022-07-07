import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonsService } from 'lessons/lessons.service';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { subtractLessonsFromAvailabilities } from './availability.utils';
import { Availability } from './entities/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private lessonsService: LessonsService,
  ) {}

  async getInstructorAvailabilities(
    instructorId: number,
    from: Date,
    to: Date,
  ) {
    const availabilities = this.availabilityRepository.find({
      where: {
        instructor: {
          id: instructorId,
        },
        from: MoreThanOrEqual(from),
        to: LessThanOrEqual(to),
      },
    });

    return availabilities;
  }

  async getPublicInstructorAvailability(
    instructorId: number,
    from: Date,
    to: Date,
  ) {
    const availabilities = await this.getInstructorAvailabilities(
      instructorId,
      from,
      to,
    );
    const lessons = await this.lessonsService.getLessonsByInstructor(
      instructorId,
      from,
      to,
    );

    return subtractLessonsFromAvailabilities(availabilities, lessons);
  }
}
