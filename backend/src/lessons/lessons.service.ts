import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonStatus } from '@osk/shared';
import { AvailabilityService } from 'availability/availability.service';
import { InstructorsService } from 'instructors/instructors.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { TraineesService } from 'trainees/trainees.service';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Try } from 'types/Try';
import { VehicleService } from 'vehicles/vehicles.service';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private organizationDomainService: OrganizationDomainService,
    private instructorsService: InstructorsService,
    @Inject(forwardRef(() => AvailabilityService))
    private availabilityService: AvailabilityService,
    private traineesService: TraineesService,
    private vehicleService: VehicleService,
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

  async createTraineeLesson(
    instructorId: number,
    traineeId: number,
    vehicleId: number,
    from: Date,
    to: Date,
  ): Promise<
    Try<
      number,
      | 'INSTRUCTOR_DOES_NOT_EXIST'
      | 'TRAINEE_DOES_NOT_EXIST'
      | 'VEHICLE_DOES_NOT_EXIST'
      | 'COLLIDING_LESSON'
      | 'INSTRUCTOR_OCCUPIED'
    >
  > {
    const trainee = await this.traineesService.findOneByUserId(traineeId);

    if (trainee === null) {
      return {
        ok: false,
        error: 'TRAINEE_DOES_NOT_EXIST',
      };
    }

    const instructor = await this.instructorsService.findOne(instructorId);
    if (instructor === null) {
      return {
        ok: false,
        error: 'INSTRUCTOR_DOES_NOT_EXIST',
      };
    }

    const vehicle = await this.vehicleService.findOneById(vehicleId);
    if (vehicle === null) {
      return {
        ok: false,
        error: 'VEHICLE_DOES_NOT_EXIST',
      };
    }

    const isInstructorAvailable =
      await this.availabilityService.isInstructorAvailable(
        instructorId,
        from,
        to,
      );

    if (!isInstructorAvailable) {
      return {
        ok: false,
        error: 'INSTRUCTOR_OCCUPIED',
      };
    }

    const collidingLessonsCount = await this.lessonRepository.count({
      where: {
        instructor: {
          id: instructorId,
        },
        from: LessThanOrEqual(to),
        to: MoreThanOrEqual(from),
        status: Not(LessonStatus.Canceled),
      },
    });

    if (collidingLessonsCount > 0) {
      return {
        ok: false,
        error: 'COLLIDING_LESSON',
      };
    }

    const insertResult = await this.lessonRepository.insert({
      from,
      to,
      status: LessonStatus.Requested,
      instructor,
      trainee,
      vehicle,
    });

    const createdLessonId: number = insertResult.identifiers[0]?.id;

    return { ok: true, data: createdLessonId };
  }
}