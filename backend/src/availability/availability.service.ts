import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CurrentUserService } from '../current-user/current-user.service';
import { InstructorsService } from '../instructors/instructors.service';
// eslint-disable-next-line import/no-cycle
import { LessonsService } from '../lessons/lessons.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { subtractLessonsFromAvailabilities } from './availability.utils';
import { Availability } from './entities/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    @Inject(forwardRef(() => LessonsService))
    private lessonsService: LessonsService,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
    private instructorsService: InstructorsService,
  ) {}

  async getInstructorAvailabilities(
    instructorId: number,
    from: Date,
    to: Date,
  ) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const availabilities = this.availabilityRepository.find({
      where: {
        instructor: {
          id: instructorId,
          user: {
            organizationId,
          },
        },
        from: MoreThanOrEqual(from),
        to: LessThanOrEqual(to),
      },
    });

    return availabilities;
  }

  async getAvailabilitiesByInstructorUserId(
    userId: number,
    from: Date,
    to: Date,
  ) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const availabilities = this.availabilityRepository.find({
      where: {
        instructor: {
          user: {
            id: userId,
            organizationId,
          },
        },
        from: MoreThanOrEqual(from),
        to: LessThanOrEqual(to),
      },
    });

    return availabilities;
  }

  async isInstructorAvailable(instructorId: number, from: Date, to: Date) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const availabilities = await this.availabilityRepository.count({
      where: {
        instructor: {
          id: instructorId,
          user: {
            organizationId,
          },
        },
        from: LessThanOrEqual(from),
        to: MoreThanOrEqual(to),
      },
    });

    return availabilities > 0;
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

  async createAvailability(
    from: Date,
    to: Date,
  ): Promise<Try<number, 'INSTRUCTOR_NOT_FOUND' | 'COLLIDING_AVAILABILITY'>> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_NOT_FOUND');
    }

    const countOfAvailabilityInSlot = await this.availabilityRepository.count({
      where: {
        from: LessThan(to),
        to: MoreThan(from),
      },
    });

    if (countOfAvailabilityInSlot > 0) {
      return getFailure('COLLIDING_AVAILABILITY');
    }

    const insertAvailability = await this.availabilityRepository.insert({
      instructor,
      from,
      to,
    });

    const createdAvailabilityId: number = insertAvailability.identifiers[0]?.id;

    return getSuccess(createdAvailabilityId);
  }

  async updateAvailability(
    availabilityId: number,
    from?: Date,
    to?: Date,
  ): Promise<
    Try<
      undefined,
      | 'INSTRUCTOR_NOT_FOUND'
      | 'COLLIDING_AVAILABILITY'
      | 'AVAILABILITY_NOT_FOUND'
    >
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_NOT_FOUND');
    }

    const availabilityToBeUpdated = await this.availabilityRepository.findOne({
      where: {
        id: availabilityId,
        instructor: {
          id: instructor.id,
        },
      },
    });

    if (availabilityToBeUpdated === null) {
      return getFailure('AVAILABILITY_NOT_FOUND');
    }

    const updatedAvailability = this.availabilityRepository.merge(
      availabilityToBeUpdated,
      {
        from,
        to,
      },
    );

    const countOfAvailabilityInSlot = await this.availabilityRepository.count({
      where: {
        from: LessThan(updatedAvailability.to),
        to: MoreThan(updatedAvailability.from),
        id: Not(availabilityToBeUpdated.id),
      },
    });

    if (countOfAvailabilityInSlot > 0) {
      return getFailure('COLLIDING_AVAILABILITY');
    }

    await this.availabilityRepository.save(updatedAvailability);

    return getSuccess(undefined);
  }

  async deleteAvailability(
    availabilityId: number,
  ): Promise<
    Try<undefined, 'INSTRUCTOR_NOT_FOUND' | 'AVAILABILITY_NOT_FOUND'>
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_NOT_FOUND');
    }

    const result = await this.availabilityRepository.delete({
      id: availabilityId,
      instructor: {
        id: instructor.id,
      },
    });

    const deletedCount = result.affected ?? 0;

    if (deletedCount === 0) {
      return getFailure('AVAILABILITY_NOT_FOUND');
    }

    return getSuccess(undefined);
  }
}
