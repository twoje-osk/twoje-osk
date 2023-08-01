import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { UserArguments } from '../types/UserArguments';
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
      relations: {
        organization: true,
        instructor: true,
        trainee: true,
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
    password?: string,
  ) {
    const newUser = await this.createUserWithoutSave({
      email,
      firstName,
      isActive,
      lastName,
      phoneNumber,
      password,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async update(
    { password, ...baseUserProperties }: Partial<UserArguments>,
    userId: number,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const passwordUserProperties = password
      ? {
          password: await this.getHashedPassword(password),
        }
      : {};
    const userProperties = {
      ...baseUserProperties,
      ...passwordUserProperties,
    };

    const updatedUser = this.usersRepository.update(
      {
        id: userId,
        organization: { id: organizationId },
      },
      userProperties,
    );

    return updatedUser;
  }

  async changePassword(userId: number, password: string) {
    const hashedPassword = await this.getHashedPassword(password);

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

  async createUserWithoutSave(user: UserArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const hashedPassword =
      user.password !== undefined
        ? await this.getHashedPassword(user.password)
        : undefined;

    const userToCreate = {
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
      organization: { id: organizationId },
    };

    return this.usersRepository.create(userToCreate);
  }

  getHashedPassword(password: string) {
    return argon.hash(password);
  }
}
