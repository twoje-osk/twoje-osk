import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonsService } from 'lessons/lessons.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
}
