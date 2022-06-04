import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
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
}
