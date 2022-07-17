import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UsersService } from 'users/users.service';
import { getFailure, getSuccess, Try } from 'types/Try';
import { DriversLicenseCategory } from 'driversLicenseCategory/entities/driversLicenseCategory.entity';
import { Instructor } from './entities/instructor.entity';
import { User } from '../users/entities/user.entity';
import { InstructorFields, InstructorUpdateFields } from './instructors.types';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(DriversLicenseCategory)
    private driversLicenseCategoryRepository: Repository<DriversLicenseCategory>,
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
        instructorsQualifications: true,
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
        instructorsQualifications: true,
      },
    });
    return user;
  }

  @Transactional()
  async create(
    instructor: InstructorFields,
  ): Promise<Try<Instructor, 'EMAIL_ALREADY_TAKEN'>> {
    const duplicatedUser = await this.usersService.findOneByEmail(
      instructor.user.email,
    );

    if (duplicatedUser) {
      return getFailure('EMAIL_ALREADY_TAKEN');
    }

    const newUser = this.usersService.createUserWithoutSave({
      ...instructor.user,
    });

    // eslint-disable-next-line no-param-reassign
    instructor.instructorsQualifications =
      await this.driversLicenseCategoryRepository.find({
        where: {
          name: In(instructor.instructorsQualifications),
        },
      });

    const newInstructor = this.instructorsRepository.create({
      user: newUser,
      registrationNumber: instructor.registrationNumber,
      licenseNumber: instructor.licenseNumber,
      instructorsQualifications: instructor.instructorsQualifications,
    });
    newUser.instructor = newInstructor;
    await this.usersRepository.save(newUser);
    const createdInstructor = await this.instructorsRepository.save(
      newInstructor,
    );
    return getSuccess(createdInstructor);
  }

  @Transactional()
  async update(
    instructor: InstructorUpdateFields,
    instructorId: number,
  ): Promise<Try<Instructor, 'NO_SUCH_INSTRUCTOR' | 'EMAIL_ALREADY_TAKEN'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const instructorToBeUpdated = await this.instructorsRepository.findOne({
      where: {
        id: instructorId,
        user: { organization: { id: organizationId } },
      },
      relations: {
        user: true,
      },
    });

    if (instructorToBeUpdated === null) {
      return getFailure('NO_SUCH_INSTRUCTOR');
    }

    const { user } = instructor;
    if (user !== undefined) {
      if (
        user.email !== undefined &&
        user.email !== instructorToBeUpdated.user.email
      ) {
        const userByEmail = await this.usersService.findOneByEmail(user.email);

        if (userByEmail !== null) {
          return getFailure('EMAIL_ALREADY_TAKEN');
        }
      }
      await this.usersRepository.save(
        this.usersRepository.merge(instructorToBeUpdated.user, user),
      );
    }

    if (instructor.instructorsQualifications !== undefined) {
      // eslint-disable-next-line no-param-reassign
      instructor.instructorsQualifications =
        await this.driversLicenseCategoryRepository.find({
          where: {
            name: In(instructor.instructorsQualifications),
          },
        });
    }

    const updatedInstructor = await this.instructorsRepository.save(
      this.instructorsRepository.merge(instructorToBeUpdated, instructor),
    );

    return getSuccess(updatedInstructor);
  }
}
