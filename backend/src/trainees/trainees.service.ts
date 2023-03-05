import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { DriversLicenseCategoriesService } from '../drivers-license-category/drivers-license-category.service';
// import { CourseReport } from '../course-reports/entities/course-report.entity';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
// import { ReportEntriesService } from '../report-entries/report-entries.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Trainee } from './entities/trainee.entity';
import { TraineeArguments, TraineeArgumentsUpdate } from './trainees.types';

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
  ) {}

  async findAll() {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const users = await this.traineesRepository.find({
      where: {
        user: {
          organizationId,
        },
      },
      order: {
        user: {
          createdAt: 'DESC',
        },
      },
      relations: {
        user: true,
      },
    });

    return users;
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

  @Transactional()
  async create(
    trainee: TraineeArguments,
  ): Promise<
    Try<Trainee, 'TRAINEE_OR_USER_FOUND' | 'DRIVER_LICENSE_CATEGORY_NOT_FOUND'>
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
      trainee.pesel === null
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

    const userToBeCreated = this.usersService.createUserWithoutSave(
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
      // courseReport: initializedReport,
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

    return getSuccess(createdTrainee!);
  }

  @Transactional()
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

  @Transactional()
  async disable(
    traineeId: number,
  ): Promise<Try<undefined, 'TRAINEE_NOT_FOUND' | 'TRAINEE_ALREADY_DISABLED'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const traineeToDisable = await this.traineesRepository.findOne({
      where: {
        id: traineeId,
        user: { organizationId },
      },
      relations: {
        user: true,
      },
    });

    if (traineeToDisable === null) {
      return getFailure('TRAINEE_NOT_FOUND');
    }

    if (traineeToDisable.user.isActive === false) {
      return getFailure('TRAINEE_ALREADY_DISABLED');
    }

    traineeToDisable.user.isActive = false;

    await this.usersRepository.save(traineeToDisable.user);

    return getSuccess(undefined);
  }
}
