import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  Repository,
  Raw,
} from 'typeorm';
import { DriversLicenseCategoriesService } from '../drivers-license-category/drivers-license-category.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { getLimitArguments } from '../utils/presentationArguments';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { Trainee } from './entities/trainee.entity';
import { isTraineeSortField, isTraineeUserSortField } from './trainee.utils';
import {
  TraineeArguments,
  TraineeArgumentsUpdate,
  TraineePresentationArguments,
  TraineePresentationFilterArguments,
  TraineePresentationSortArguments,
} from './trainees.types';
import { escapeForbiddenCharsFromFilter } from '../instructors/instructors.utils';
import { CourseReportsService } from '../course-reports/course-reports.service';

@Injectable()
export class TraineesService {
  constructor(
    @InjectRepository(Trainee)
    private traineesRepository: Repository<Trainee>,
    private organizationDomainService: OrganizationDomainService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private driversLicenseCategoriesService: DriversLicenseCategoriesService,
    private courseReportsService: CourseReportsService,
  ) {}

  private buildOrderOption(
    sortArguments: TraineePresentationSortArguments | undefined,
  ): FindManyOptions<Trainee>['order'] {
    const sortOrder = sortArguments?.sortOrder ?? 'desc';

    const defaultSortOrder = {
      user: {
        createdAt: sortOrder,
      },
    };

    if (sortArguments?.sortBy === undefined) {
      return defaultSortOrder;
    }

    if (isTraineeUserSortField(sortArguments.sortBy)) {
      return {
        user: {
          [sortArguments.sortBy]: sortOrder,
        },
      };
    }

    if (isTraineeSortField(sortArguments.sortBy)) {
      return {
        [sortArguments.sortBy]: sortOrder,
      };
    }

    return defaultSortOrder;
  }

  private buildWhereOption(
    filterArguments: TraineePresentationFilterArguments | undefined,
    organizationId: number,
  ): FindOptionsWhere<Trainee> {
    const fullNameProperty =
      filterArguments?.searchedPhrase !== undefined
        ? Raw(
            () => {
              return `"firstName" || ' ' || "lastName" || ' ' || "phoneNumber" ILIKE :searchedPhrase`;
            },
            {
              searchedPhrase: `%${escapeForbiddenCharsFromFilter(
                filterArguments.searchedPhrase,
              )}%`,
            },
          )
        : undefined;

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

    const isActiveProperty = filterArguments?.isActive;

    return {
      user: {
        firstName: fullNameProperty ?? firstNameProperty,
        lastName: lastNameProperty,
        email: emailProperty,
        isActive: isActiveProperty,
        phoneNumber: phoneNumberProperty,
        organizationId,
      },
    };
  }

  async findAll(presentationArguments?: TraineePresentationArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [trainees, count] = await this.traineesRepository.findAndCount({
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

    return { trainees, count };
  }

  async findOneById(id: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    return this.traineesRepository.findOne({
      where: {
        id,
        user: {
          organizationId,
        },
      },
      relations: {
        user: true,
      },
    });
  }

  async findOneByUserId(userId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    return this.traineesRepository.findOne({
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

  @TransactionalWithTry()
  async create(
    trainee: TraineeArguments,
  ): Promise<
    Try<
      Trainee,
      | 'TRAINEE_OR_USER_FOUND'
      | 'DRIVER_LICENSE_CATEGORY_NOT_FOUND'
      | 'REPORT_NOT_FOUND_FOR_SPECIFIED_LICENSE_CATEGORY_ID'
      | 'REPORT_ALREADY_CREATED_FOR_TRAINEE'
    >
  > {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const emailCondition: FindOptionsWhere<Trainee> = {
      user: {
        email: trainee.user.email,
        organizationId,
      },
    };

    const findTraineeCondition: FindOptionsWhere<Trainee>[] =
      trainee.pesel === null || trainee.pesel === undefined
        ? [emailCondition]
        : [
            emailCondition,
            {
              pesel: trainee.pesel,
              user: {
                organizationId,
              },
            },
          ];

    const doesUserOrTraineeExistWithEmailOrPesel =
      await this.traineesRepository.findOne({
        where: findTraineeCondition,
      });

    if (doesUserOrTraineeExistWithEmailOrPesel !== null) {
      return getFailure('TRAINEE_OR_USER_FOUND');
    }

    const userToBeCreated = await this.usersService.createUserWithoutSave(
      trainee.user,
    );

    const driversLicenseCategory =
      await this.driversLicenseCategoriesService.findOneCategoryById(
        trainee.driversLicenseCategoryId,
      );

    if (driversLicenseCategory === null) {
      return getFailure('DRIVER_LICENSE_CATEGORY_NOT_FOUND');
    }

    const traineeToBeCreated = this.traineesRepository.create({
      user: userToBeCreated,
      pesel: trainee.pesel,
      driversLicenseNumber: trainee.driversLicenseNumber,
      dateOfBirth: trainee.dateOfBirth,
      pkk: trainee.pkk,
      driversLicenseCategory: driversLicenseCategory!,
    });

    userToBeCreated.trainee = traineeToBeCreated;
    await this.usersRepository.save(userToBeCreated);

    const { id: createdTraineeId } = await this.traineesRepository.save(
      traineeToBeCreated,
    );

    const createdTrainee = await this.traineesRepository.findOne({
      where: { id: createdTraineeId },
      relations: { user: true },
    });

    if (createdTrainee == null) {
      throw new Error('Created trainee is null');
    }

    const courseReportResult = await this.courseReportsService.create(
      createdTrainee.id,
      createdTrainee.driversLicenseCategoryId,
    );

    if (!courseReportResult.ok) {
      return getFailure(courseReportResult.error);
    }

    return getSuccess(createdTrainee);
  }

  @TransactionalWithTry()
  async update(
    trainee: TraineeArgumentsUpdate,
    traineeId: number,
  ): Promise<Try<undefined, 'TRAINEE_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const traineeToUpdate = await this.traineesRepository.findOne({
      where: {
        id: traineeId,
        user: { organizationId },
      },
      relations: {
        user: true,
      },
    });

    if (traineeToUpdate === null) {
      return getFailure('TRAINEE_NOT_FOUND');
    }

    const updatedTrainee = await this.traineesRepository.save(
      this.traineesRepository.merge(traineeToUpdate, trainee),
    );

    if (trainee.user !== undefined) {
      await this.usersRepository.save(updatedTrainee.user);
    }

    return getSuccess(undefined);
  }
}
