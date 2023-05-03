import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
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

  @TransactionalWithTry()
  async create(
    trainee: TraineeArguments,
  ): Promise<Try<Trainee, 'TRAINEE_OR_USER_FOUND'>> {
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

    const createdUser = this.usersService.createUserWithoutSave(trainee.user);

    const createdTrainee = this.traineesRepository.create({
      user: createdUser,
      pesel: trainee.pesel,
      driversLicenseNumber: trainee.driversLicenseNumber,
      dateOfBirth: trainee.dateOfBirth,
      pkk: trainee.pkk,
    });

    createdUser.trainee = createdTrainee;
    await this.usersRepository.save(createdUser);

    await this.traineesRepository.save(createdTrainee);

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

  @TransactionalWithTry()
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
