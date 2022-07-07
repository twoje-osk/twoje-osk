import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private organizationDomainService: OrganizationDomainService,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    return this.usersRepository.findOne({
      where: { id, organization: { id: organizationId }, isActive: true },
    });
  }

  async getAll(): Promise<User[] | null> {
    return this.usersRepository.find();
  }

  async checkIfExistsByEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
    });
    return user !== undefined;
  }
}
