import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoUser } from '@osk/shared';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
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

    const updatedTrainee = this.traineesRepository.update(
      {
        id: traineeId,
        user: { organization: { id: organizationId } },
      },
      trainee,
    );
    return updatedTrainee;
  }
}
