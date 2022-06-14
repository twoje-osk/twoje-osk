import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string, organization: Organization) {
    return this.usersRepository.findOne({
      where: { email, organization },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        organization: true,
      },
    });
  }

  async getAll(): Promise<User[] | null> {
    return this.usersRepository.find();
  }
}
