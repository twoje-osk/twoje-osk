import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UsersService } from 'users/users.service';
import { getFailure, getSuccess, Try } from 'types/Try';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import { InstructorUpdateFields } from './instructors.types';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private organizationDomainService: OrganizationDomainService,
  ) {}

  async findAll() {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const users = await this.instructorsRepository.find({
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

  @Transactional()
  async create(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const newUser = this.usersRepository.create({
      email,
      password: '',
      firstName,
      lastName,
      phoneNumber,
      isActive: false,
      organization: { id: organizationId },
    });
    await this.usersRepository.save(newUser);

    const newInstructor = this.instructorsRepository.create({
      user: newUser,
    });
    await this.instructorsRepository.save(newInstructor);

    return newInstructor;
  }

  @Transactional()
  async update(
    instructor: InstructorUpdateFields,
    instructorId: number,
  ): Promise<Try<number, 'NO_SUCH_INSTRUCTOR' | 'EMAIL_ALREADY_TAKEN'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const instructorToBeUpdated = await this.instructorsRepository.findOne({
      where: {
        id: instructorId,
        user: { organization: { id: organizationId } },
      },
    });

    if (instructorToBeUpdated === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    const { user } = instructor;
    if (
      user !== undefined &&
      user.email !== undefined &&
      user.email !== instructorToBeUpdated.user.email
    ) {
      const userByEmail = await this.usersService.findOneByEmail(user.email);

      if (userByEmail !== null) {
        return getFailure('EMAIL_ALREADY_TAKEN');
      }

      await this.usersRepository.save(user);
    }

    const updatedInstructor = await this.instructorsRepository.save(
      this.instructorsRepository.merge(instructorToBeUpdated, instructor),
    );

    return getSuccess(updatedInstructor.id);
  }
}
