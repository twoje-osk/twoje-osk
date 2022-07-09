import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoUser } from '@osk/shared';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Trainee } from './entities/trainee.entity';

interface TraineeArgument {
  user?: DtoUser;
  pesel?: string;
  pkk?: string;
  driversLicenseNumber: string | null;
}

@Injectable()
export class TraineesService {
  constructor(
    @InjectRepository(Trainee)
    private traineesRepository: Repository<Trainee>,
    private organizationDomainService: OrganizationDomainService,
    private dataSource: DataSource,
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

  async update(trainee: Partial<TraineeArgument>, traineeId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    // eslint-disable-next-line consistent-return
    await this.dataSource.transaction(async (entityManager) => {
      const traineesRepository = entityManager.getRepository(Trainee);
      const usersRepository = entityManager.getRepository(User);

      const traineeToUpdate = await traineesRepository.findOne({
        where: {
          id: traineeId,
          user: { organization: { id: organizationId } },
        },
        relations: {
          user: true,
        },
      });

      if (traineeToUpdate === null) {
        return new Error('TRAINEE_NOT_FOUND');
      }

      const updatedTrainee = await traineesRepository.save(
        traineesRepository.merge(traineeToUpdate, trainee),
      );

      if (trainee.user !== undefined) {
        await usersRepository.save(updatedTrainee.user);
      }
    });

    return {};
  }
}
