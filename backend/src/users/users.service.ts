import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface UserArguments {
  email?: string;
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
    return this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: {
        organization: true,
      },
    });
  }

  async findOneByEmailFromAll(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        organization: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    return this.usersRepository.findOne({
      where: { email, organizationId },
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.usersRepository.find();
  }

  async create(
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    phoneNumber: string,
  ) {
    const newUser = this.createUserWithoutSave({
      email,
      firstName,
      isActive,
      lastName,
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

  async changePassword(userId: number, password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const updatedUser = this.usersRepository.update(
      {
        id: userId,
      },
      {
        password: hashedPassword,
      },
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
      password: undefined,
      createdAt: new Date(),
      organization: { id: organizationId },
    };

    return this.usersRepository.create(userToCreate);
  }
}
