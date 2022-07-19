import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonStatus } from '@osk/shared';
import { AvailabilityService } from 'availability/availability.service';
import { CurrentUserService } from 'current-user/current-user.service';
import { InstructorsService } from 'instructors/instructors.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { TraineesService } from 'trainees/trainees.service';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { getFailure, getSuccess, Try } from 'types/Try';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
    private instructorsService: InstructorsService,
    @Inject(forwardRef(() => AvailabilityService))
    private availabilityService: AvailabilityService,
    private traineesService: TraineesService,
  ) {}

  async findAllByTrainee(traineeId: number, from?: Date, to?: Date) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    return this.lessonRepository.find({
      where: {
        trainee: {
          user: { id: traineeId, organizationId },
        },
        from: from ? MoreThanOrEqual(from) : undefined,
        to: to ? LessThanOrEqual(to) : undefined,
        status: Not(LessonStatus.Canceled),
      },
    });
  }

  async getAreThereCollidingLessons(
    instructorId: number,
    from: Date,
    to: Date,
    excludedLessonId?: number,
  ): Promise<boolean> {
    const collidingLessonsCount = await this.lessonRepository.count({
      where: {
        id: excludedLessonId ? Not(excludedLessonId) : undefined,
        instructor: {
          id: instructorId,
        },
        from: LessThan(to),
        to: MoreThan(from),
        status: Not(LessonStatus.Canceled),
      },
    });

    return collidingLessonsCount > 0;
  }

  async getById(lessonId: number, traineeUserId?: number) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    return this.lessonRepository.findOne({
      where: {
        id: lessonId,
        trainee: {
          user: { id: traineeUserId, organizationId },
        },
      },
    });
  }

  async getLessonsByInstructor(instructorId: number, from: Date, to: Date) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const availabilities = this.lessonRepository.find({
      where: {
        instructor: {
          id: instructorId,
          user: {
            organizationId,
          },
        },
        from: MoreThanOrEqual(from),
        to: LessThanOrEqual(to),
        status: Not(LessonStatus.Canceled),
      },
    });

    return availabilities;
  }

  async updateTraineeLesson(
    lessonId: number,
    from: Date,
    to: Date,
  ): Promise<
    Try<
      undefined,
      | 'LESSON_DOES_NOT_EXIST'
      | 'LESSON_CANNOT_BE_UPDATED'
      | 'INSTRUCTOR_DOES_NOT_EXIST'
      | 'TRAINEE_DOES_NOT_EXIST'
      | 'COLLIDING_LESSON'
      | 'INSTRUCTOR_OCCUPIED'
    >
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const lesson = await this.getById(lessonId, userId);

    if (lesson === null) {
      return getFailure('LESSON_DOES_NOT_EXIST');
    }

    if (
      lesson.status !== LessonStatus.Requested &&
      lesson.status !== LessonStatus.Accepted
    ) {
      return getFailure('LESSON_CANNOT_BE_UPDATED');
    }

    const isInstructorAvailable =
      await this.availabilityService.isInstructorAvailable(
        lesson.traineeId,
        from,
        to,
      );

    if (!isInstructorAvailable) {
      return getFailure('INSTRUCTOR_OCCUPIED');
    }

    const areThereCollidingLessons = await this.getAreThereCollidingLessons(
      lesson.instructorId,
      from,
      to,
      lessonId,
    );

    if (areThereCollidingLessons) {
      return getFailure('COLLIDING_LESSON');
    }

    await this.lessonRepository.update(
      {
        id: lessonId,
      },
      {
        from,
        to,
        status: LessonStatus.Requested,
      },
    );

    return getSuccess(undefined);
  }

  async createTraineeLesson(
    instructorId: number,
    traineeId: number,
    from: Date,
    to: Date,
  ): Promise<
    Try<
      number,
      | 'INSTRUCTOR_DOES_NOT_EXIST'
      | 'TRAINEE_DOES_NOT_EXIST'
      | 'COLLIDING_LESSON'
      | 'INSTRUCTOR_OCCUPIED'
    >
  > {
    const trainee = await this.traineesService.findOneByUserId(traineeId);

    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }

    const instructor = await this.instructorsService.findOne(instructorId);
    if (instructor === null) {
      return getFailure('INSTRUCTOR_DOES_NOT_EXIST');
    }

    const isInstructorAvailable =
      await this.availabilityService.isInstructorAvailable(
        instructorId,
        from,
        to,
      );

    if (!isInstructorAvailable) {
      return getFailure('INSTRUCTOR_OCCUPIED');
    }

    const areThereCollidingLessons = await this.getAreThereCollidingLessons(
      instructorId,
      from,
      to,
    );

    if (areThereCollidingLessons) {
      return getFailure('COLLIDING_LESSON');
    }

    const insertResult = await this.lessonRepository.insert({
      from,
      to,
      status: LessonStatus.Requested,
      instructor,
      trainee,
    });

    const createdLessonId: number = insertResult.identifiers[0]?.id;

    return getSuccess(createdLessonId);
  }

  async cancelTraineeLesson(
    lessonId: number,
  ): Promise<
    Try<undefined, 'LESSON_DOES_NOT_EXIST' | 'LESSON_CANNOT_BE_UPDATED'>
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const lesson = await this.getById(lessonId, userId);

    if (lesson === null) {
      return getFailure('LESSON_DOES_NOT_EXIST');
    }

    if (lesson.status === LessonStatus.Finished) {
      return getFailure('LESSON_CANNOT_BE_UPDATED');
    }

    await this.lessonRepository.update(
      {
        id: lessonId,
      },
      {
        status: LessonStatus.Canceled,
      },
    );

    return getSuccess(undefined);
  }
}
