import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getLessonsByInstructor(instructorId: number, from: Date, to: Date) {
    // TODO: Status check
    const availabilities = this.lessonRepository.find({
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
}
