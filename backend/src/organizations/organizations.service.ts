import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private usersRepository: Repository<Organization>,
  ) {}

  getOrganizationBySlug(slug: string) {
    return this.usersRepository.findOne({
      where: {
        slug,
      },
    });
  }
}
