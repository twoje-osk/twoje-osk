import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonStatus } from '@osk/shared';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async findAllByTrainee(traineeId: number, from?: Date, to?: Date) {
    return this.lessonRepository.find({
      where: {
        trainee: {
          user: { id: traineeId },
        },
        from: from ? MoreThanOrEqual(from) : undefined,
        to: to ? LessThanOrEqual(to) : undefined,
      },
    });
  }

  async getLessonsByInstructor(instructorId: number, from: Date, to: Date) {
    const availabilities = this.lessonRepository.find({
      where: {
        instructor: {
          id: instructorId,
        },
        from: MoreThanOrEqual(from),
        to: LessThanOrEqual(to),
        status: Not(LessonStatus.Canceled),
      },
    });

    return availabilities;
  }
}
