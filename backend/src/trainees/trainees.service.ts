import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  TraineeArguments,
  TraineeArgumentsUpdate,
} from 'trainees/trainees.types';
import { Trainee } from './entities/trainee.entity';

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
          organization: {
            id: organizationId,
          },
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

    const user = await this.traineesRepository.findOne({
      where: {
        id,
        user: {
          organization: {
            id: organizationId,
          },
        },
      },
      relations: {
        user: true,
      },
    });

    return user;
  }

  @Transactional()
  async create(trainee: TraineeArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const doesUserOrTraineeExistWithEmailOrPesel =
      await this.traineesRepository.findOne({
        where: [
          {
            user: {
              email: trainee.user.email,
              organization: { id: organizationId },
            },
          },
          {
            pesel: trainee.pesel,
            user: {
              organization: { id: organizationId },
            },
          },
        ],
      });

    if (doesUserOrTraineeExistWithEmailOrPesel !== null) {
      throw new Error('TRAINEE_OR_USER_FOUND');
    }

    const createdUser = this.usersService.createUserWithoutSave(trainee.user);

    const createdTrainee = this.traineesRepository.create({
      user: createdUser,
      pesel: trainee.pesel,
      driversLicenseNumber: trainee.driversLicenseNumber,
      pkk: trainee.pkk,
    });

    createdUser.trainee = createdTrainee;
    await this.usersRepository.save(createdUser);

    await this.traineesRepository.save(createdTrainee);
    return createdTrainee;
  }

  @Transactional()
  async update(trainee: TraineeArgumentsUpdate, traineeId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const traineeToUpdate = await this.traineesRepository.findOne({
      where: {
        id: traineeId,
        user: { organization: { id: organizationId } },
      },
    });

    if (traineeToUpdate === null) {
      throw new Error('TRAINEE_NOT_FOUND');
    }

    const updatedTrainee = await this.traineesRepository.save(
      this.traineesRepository.merge(traineeToUpdate, trainee),
    );

    if (trainee.user !== undefined) {
      await this.usersRepository.save(updatedTrainee.user);
    }

    return {};
  }

  @Transactional()
  async disable(traineeId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const traineeToDisable = await this.traineesRepository.findOne({
      where: {
        id: traineeId,
        user: { organization: { id: organizationId } },
      },
      relations: {
        user: true,
      },
    });

    if (traineeToDisable === null) {
      throw new Error('TRAINEE_NOT_FOUND');
    }

    if (traineeToDisable.user.isActive === false) {
      throw new Error('TRAINEE_ALREADY_DISABLED');
    }

    const userToDisable = {
      ...traineeToDisable.user,
      isActive: false,
    };

    await this.usersRepository.save(userToDisable);

    return {};
  }
}
