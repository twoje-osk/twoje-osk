import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Time } from '@osk/shared';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { CurrentUserService } from '../current-user/current-user.service';
import { InstructorsService } from '../instructors/instructors.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { DefaultAvailability } from './entities/defaultAvailability.entity';

@Injectable()
export class DefaultAvailabilityService {
  constructor(
    @InjectRepository(DefaultAvailability)
    private defaultAvailabilityRepository: Repository<DefaultAvailability>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
    private instructorsService: InstructorsService,
  ) {}

  async getDefaultAvailabilitiesByInstructorUserId(userId: number) {
    const organizationId =
      this.organizationDomainService.getRequestOrganization().id;

    const availabilities = this.defaultAvailabilityRepository.find({
      where: {
        instructor: {
          user: {
            id: userId,
            organizationId,
          },
        },
      },
    });

    return availabilities;
  }

  async createDefaultAvailability(
    from: Time,
    to: Time,
    dayOfWeek: number,
  ): Promise<Try<number, 'INSTRUCTOR_NOT_FOUND' | 'COLLIDING_AVAILABILITY'>> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_NOT_FOUND');
    }

    const countOfAvailabilityInSlot =
      await this.defaultAvailabilityRepository.count({
        where: {
          from: LessThan(to),
          to: MoreThan(from),
          dayOfWeek,
        },
      });

    if (countOfAvailabilityInSlot > 0) {
      return getFailure('COLLIDING_AVAILABILITY');
    }

    const insertAvailability = await this.defaultAvailabilityRepository.insert({
      instructor,
      from,
      to,
      dayOfWeek,
    });

    const createdAvailabilityId: number = insertAvailability.identifiers[0]?.id;

    return getSuccess(createdAvailabilityId);
  }

  async updateDefaultAvailability(
    availabilityId: number,
    from?: Date,
    to?: Date,
    dayOfWeek?: number,
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

    const availabilityToBeUpdated =
      await this.defaultAvailabilityRepository.findOne({
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

    const updatedAvailability = this.defaultAvailabilityRepository.merge(
      availabilityToBeUpdated,
      {
        from,
        to,
        dayOfWeek,
      },
    );

    const countOfAvailabilityInSlot =
      await this.defaultAvailabilityRepository.count({
        where: {
          from: LessThan(updatedAvailability.to),
          to: MoreThan(updatedAvailability.from),
          id: Not(availabilityToBeUpdated.id),
          dayOfWeek,
        },
      });

    if (countOfAvailabilityInSlot > 0) {
      return getFailure('COLLIDING_AVAILABILITY');
    }

    await this.defaultAvailabilityRepository.save(updatedAvailability);

    return getSuccess(undefined);
  }

  async deleteDefaultAvailability(
    availabilityId: number,
  ): Promise<
    Try<undefined, 'INSTRUCTOR_NOT_FOUND' | 'AVAILABILITY_NOT_FOUND'>
  > {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const instructor = await this.instructorsService.findOneByUserId(userId);

    if (instructor === null) {
      return getFailure('INSTRUCTOR_NOT_FOUND');
    }

    const result = await this.defaultAvailabilityRepository.delete({
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
