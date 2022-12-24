import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import { InstructorFields, InstructorUpdateFields } from './instructors.types';
import { DriversLicenseCategoriesService } from '../drivers-license-category/drivers-license-category.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { UsersService } from '../users/users.service';

@Injectable()
export class InstructorsService {
  constructor(
    private driversLicenseCategoryService: DriversLicenseCategoriesService,
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private organizationDomainService: OrganizationDomainService,
  ) {}

  async findAll(isActive?: boolean) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const users = await this.instructorsRepository.find({
      where: {
        user: {
          organizationId,
          isActive,
        },
      },
      relations: {
        user: true,
        instructorsQualifications: true,
      },
    });

    return users;
  }

  async findOne(id: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const user = await this.instructorsRepository.findOne({
      where: {
        id,
        user: {
          organizationId,
        },
      },
      relations: {
        user: true,
        instructorsQualifications: true,
      },
    });
    return user;
  }

  @Transactional()
  async create(
    instructor: InstructorFields,
  ): Promise<Try<number, 'EMAIL_ALREADY_TAKEN' | 'WRONG_CATEGORIES'>> {
    const duplicatedUser = await this.usersService.findOneByEmail(
      instructor.user.email,
    );

    if (duplicatedUser) {
      return getFailure('EMAIL_ALREADY_TAKEN');
    }

    const newUser = this.usersService.createUserWithoutSave({
      ...instructor.user,
    });

    const instructorsQualifications =
      await this.driversLicenseCategoryService.findCategoriesById(
        instructor.instructorsQualificationsIds,
      );

    if (instructorsQualifications === undefined) {
      return getFailure('WRONG_CATEGORIES');
    }

    const newInstructor = this.instructorsRepository.create({
      user: newUser,
      registrationNumber: instructor.registrationNumber,
      licenseNumber: instructor.licenseNumber,
      instructorsQualifications,
    });
    newUser.instructor = newInstructor;
    await this.usersRepository.save(newUser);

    const createdInstructor = await this.instructorsRepository.save(
      newInstructor,
    );

    return getSuccess(createdInstructor.id);
  }

  @Transactional()
  async update(
    instructor: InstructorUpdateFields,
    instructorId: number,
  ): Promise<
    Try<
      number,
      'NO_SUCH_INSTRUCTOR' | 'EMAIL_ALREADY_TAKEN' | 'WRONG_CATEGORIES'
    >
  > {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const instructorToBeUpdated = await this.instructorsRepository.findOne({
      where: {
        id: instructorId,
        user: { organizationId },
      },
      relations: {
        user: true,
      },
    });

    if (instructorToBeUpdated === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    const { user } = instructor;
    if (user !== undefined) {
      if (
        user.email !== undefined &&
        user.email !== instructorToBeUpdated.user.email
      ) {
        const userByEmail = await this.usersService.findOneByEmail(user.email);

        if (userByEmail !== null) {
          return getFailure('EMAIL_ALREADY_TAKEN');
        }
      }
      await this.usersRepository.save(
        this.usersRepository.merge(instructorToBeUpdated.user, user),
      );
    }
    const {
      instructorsQualificationsIds: updatedQualifications,
      ...restOfArguments
    } = instructor;

    if (updatedQualifications !== undefined) {
      const driversLicenseCategories =
        await this.driversLicenseCategoryService.findCategoriesById(
          updatedQualifications,
        );
      if (driversLicenseCategories === undefined) {
        return getFailure('WRONG_CATEGORIES');
      }
      instructorToBeUpdated.instructorsQualifications =
        driversLicenseCategories;
    }

    const updatedInstructor = await this.instructorsRepository.save(
      this.instructorsRepository.merge(instructorToBeUpdated, restOfArguments),
    );

    return getSuccess(updatedInstructor.id);
  }

  async findOneByUserId(userId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    return this.instructorsRepository.findOne({
      where: {
        user: {
          id: userId,
          organizationId,
        },
      },
      relations: {
        user: true,
      },
    });
  }
}
