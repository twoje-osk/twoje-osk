import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
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
      },
    });
    return user;
  }
}
