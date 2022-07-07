import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';

interface InstructorFields {
  user: Partial<UserFields>;
  photo: string | null;
}

interface UserFields {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string;
}

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async update(instructor: Partial<InstructorFields>, instructorId: number) {
    const { user, ...instructorWithoutUser } = instructor;
    if (user !== undefined) {
      await this.usersRepository.update(
        { instructor: { id: instructorId } },
        user,
      );
    }

    await this.instructorsRepository.update(
      { id: instructorId },
      instructorWithoutUser,
    );
  }
}
