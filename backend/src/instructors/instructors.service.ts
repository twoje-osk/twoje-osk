import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';

// interface UserValues {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phoneNumber?: string;
// }

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    private usersRepository: Repository<User>,
    private currentUserService: CurrentUserService,
  ) {}

  async findAll() {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();

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
    const { organizationId } = this.currentUserService.getRequestCurrentUser();

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
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
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

  // async update(instructor: Partial<UserValues>, instructorId: number) {
  //   const { organizationId } = this.currentUserService.getRequestCurrentUser();
  //   this.usersRepository.update(
  //     id: instructor.user.Id,
  //     instructor,
  //   );
  // }
}
