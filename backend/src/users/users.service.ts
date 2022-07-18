import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface UserArguments {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  phoneNumber?: string;
}
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
      relations: {
        organization: true,
      },
    });
  }

  async loginByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        organization: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        organization: true,
      },
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.usersRepository.find();
  }

  async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    phoneNumber: string,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const newUser = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
      isActive,
      organization: { id: organizationId },
      phoneNumber,
    });
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async update(user: Partial<UserArguments>, userId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const updatedUser = this.usersRepository.update(
      {
        id: userId,
        organization: { id: organizationId },
      },
      user,
    );

    return updatedUser;
  }

  async disable(userId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const user: Partial<UserArguments> = {};
    user.isActive = false;
    const disabledUser = this.usersRepository.update(
      {
        id: userId,
        organization: { id: organizationId },
      },
      user,
    );
    return disabledUser;
  }

  createUserWithoutSave(user: UserArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const userToCreate = {
      ...user,
      password: user.password ? bcrypt.hashSync(user.password, 10) : undefined,
      organization: { id: organizationId },
      createdAt: new Date(),
    };

    return this.usersRepository.create(userToCreate);
  }
}
