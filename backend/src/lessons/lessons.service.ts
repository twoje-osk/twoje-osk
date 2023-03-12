import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonStatus } from '@osk/shared';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  IsolationLevel,
  Propagation,
  Transactional,
} from 'typeorm-transactional-cls-hooked';
// eslint-disable-next-line import/no-cycle
import { AvailabilityService } from '../availability/availability.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { InstructorsService } from '../instructors/instructors.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { TraineesService } from '../trainees/trainees.service';
import { Try, getFailure, getSuccess } from '../types/Try';
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

  async findAllByTraineeUserId(traineeUserId: number, from?: Date, to?: Date) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    return this.lessonRepository.find({
      where: {
        trainee: {
          user: { id: traineeUserId, organizationId },
        },
        from: from ? MoreThanOrEqual(from) : undefined,
        to: to ? LessThanOrEqual(to) : undefined,
        status: Not(LessonStatus.Canceled),
      },
      relations: {
        instructor: true,
        trainee: true,
      },
    });
  }

  async findAllByInstructorUserId(
    instructorUserId: number,
    from?: Date,
    to?: Date,
  ) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    return this.lessonRepository.find({
      where: {
        instructor: {
          user: { id: instructorUserId, organizationId },
        },
        from: from ? MoreThanOrEqual(from) : undefined,
        to: to ? LessThanOrEqual(to) : undefined,
      },
      relations: {
        instructor: true,
        trainee: true,
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
      relations: {
        trainee: true,
        instructor: true,
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

  @Transactional({
    isolationLevel: IsolationLevel.SERIALIZABLE,
    propagation: Propagation.REQUIRES_NEW,
  })
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

  @Transactional({
    isolationLevel: IsolationLevel.SERIALIZABLE,
    propagation: Propagation.REQUIRES_NEW,
  })
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

  @Transactional()
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

  @Transactional()
  async createLesson(
    traineeId: number,
    from: Date,
    to: Date,
    status: LessonStatus,
  ): Promise<
    Try<number, 'INSTRUCTOR_DOES_NOT_EXIST' | 'TRAINEE_DOES_NOT_EXIST'>
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_DOES_NOT_EXIST');
    }

    const trainee = await this.traineesService.findOneById(traineeId);

    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }

    const insertResult = await this.lessonRepository.insert({
      from,
      to,
      status,
      instructor,
      trainee,
    });

    const createdLessonId: number = insertResult.identifiers[0]?.id;

    return getSuccess(createdLessonId);
  }

  @Transactional()
  async updateLesson(
    lessonId: number,
    from: Date,
    to: Date,
    status: LessonStatus,
    vehicleId?: number | null,
  ): Promise<Try<undefined, 'LESSON_NOT_FOUND'>> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const lesson = await this.lessonRepository.findOne({
      where: {
        id: lessonId,
        instructor: {
          user: { id: userId, organizationId },
        },
      },
    });

    if (lesson == null) {
      return getFailure('LESSON_NOT_FOUND');
    }

    await this.lessonRepository.update(lessonId, {
      from,
      to,
      status,
      vehicleId,
    });

    return getSuccess(undefined);
  }
}
