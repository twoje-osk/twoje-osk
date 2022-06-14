import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface UserArguments {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt?: Date;
  phoneNumber?: string;
}
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private currentUserService: CurrentUserService,
  ) {}

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

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
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
    createdAt: Date,
    phoneNumber: string,
  ) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const newUser = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
      isActive,
      organization: { id: organizationId },
      createdAt,
      phoneNumber,
    });
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async update(user: Partial<UserArguments>, userId: number) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
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
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
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
}
