import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import {
  InstructorFields,
  InstructorPresentationArguments,
  InstructorPresentationFilterArguments,
  InstructorPresentationSortArguments,
  InstructorUpdateFields,
} from './instructors.types';
import { DriversLicenseCategoriesService } from '../drivers-license-category/drivers-license-category.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { UsersService } from '../users/users.service';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { isInstructorUserSortField } from './instructors.utils';
import { getLimitArguments } from '../utils/presentationArguments';

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

  private buildOrderOption(
    sortArguments: InstructorPresentationSortArguments | undefined,
  ): FindManyOptions<Instructor>['order'] {
    const sortOrder = sortArguments?.sortOrder ?? 'desc';
    const defaultSortOrder = {
      user: {
        createdAt: sortOrder,
      },
    };
    if (sortArguments?.sortBy === undefined) {
      return defaultSortOrder;
    }

    if (isInstructorUserSortField(sortArguments.sortBy)) {
      return {
        user: {
          [sortArguments.sortBy]: sortOrder,
        },
      };
    }

    return defaultSortOrder;
  }

  private buildWhereOption(
    filterArguments: InstructorPresentationFilterArguments | undefined,
    organizationId: number,
  ): FindOptionsWhere<Instructor> {
    const firstNameProperty =
      filterArguments?.firstName !== undefined
        ? ILike(`%${filterArguments.firstName}%`)
        : undefined;

    const lastNameProperty =
      filterArguments?.lastName !== undefined
        ? ILike(`%${filterArguments.lastName}%`)
        : undefined;

    const emailProperty =
      filterArguments?.email !== undefined
        ? ILike(`%${filterArguments.email}%`)
        : undefined;

    const phoneNumberProperty =
      filterArguments?.phoneNumber !== undefined
        ? ILike(`%${filterArguments.phoneNumber}%`)
        : undefined;

    const qualificationProperty =
      filterArguments?.instructorQualification !== undefined
        ? { id: filterArguments?.instructorQualification }
        : undefined;

    const isActiveProperty = filterArguments?.isActive;

    return {
      user: {
        firstName: firstNameProperty,
        lastName: lastNameProperty,
        email: emailProperty,
        isActive: isActiveProperty,
        phoneNumber: phoneNumberProperty,
        organizationId,
      },
      instructorsQualifications: qualificationProperty,
    };
  }

  async findAll(presentationArguments?: InstructorPresentationArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [instructors, count] = await this.instructorsRepository.findAndCount({
      ...limitArguments,
      order: this.buildOrderOption(presentationArguments?.sort),
      where: this.buildWhereOption(
        presentationArguments?.filter,
        organizationId,
      ),
      relations: {
        user: true,
      },
    });

    return { instructors, count };
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

  @TransactionalWithTry()
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

  @TransactionalWithTry()
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

  async findOneByUserId(userId: number, includeFavouriteVehicles = false) {
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
        favouriteVehicles: includeFavouriteVehicles,
      },
    });
  }

  async getFavouritesByUserId(
    userId: number,
  ): Promise<Try<number[], 'NO_SUCH_INSTRUCTOR'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const instructor = await this.instructorsRepository.findOne({
      where: {
        user: {
          id: userId,
          organizationId,
        },
      },
      relations: {
        favouriteVehicles: true,
      },
    });

    if (instructor === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    return getSuccess(instructor.favouriteVehiclesIds);
  }

  async addFavourite(
    userId: number,
    vehicle: Vehicle,
  ): Promise<Try<boolean, 'NO_SUCH_INSTRUCTOR'>> {
    const instructor = await this.findOneByUserId(userId, true);

    if (instructor === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    const favouriteVehicles = instructor.favouriteVehicles ?? [];
    const isVehicleInFavourites = favouriteVehicles.some(
      (v) => v.id === vehicle.id,
    );

    if (isVehicleInFavourites) {
      return getSuccess(false);
    }

    favouriteVehicles.push(vehicle);
    instructor.favouriteVehicles = favouriteVehicles;
    await this.instructorsRepository.save(instructor);

    return getSuccess(true);
  }

  async removeFavourite(
    userId: number,
    vehicle: Vehicle,
  ): Promise<Try<boolean, 'NO_SUCH_INSTRUCTOR'>> {
    const instructor = await this.findOneByUserId(userId, true);

    if (instructor === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    const favouriteVehicles = instructor.favouriteVehicles ?? [];
    const newFavouriteVehicles = favouriteVehicles.filter(
      (v) => v.id !== vehicle.id,
    );

    instructor.favouriteVehicles = newFavouriteVehicles;
    await this.instructorsRepository.save(instructor);

    return getSuccess(true);
  }
}
