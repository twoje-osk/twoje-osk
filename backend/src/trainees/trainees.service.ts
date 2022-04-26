import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Trainee } from './entities/trainee.entity';

@Injectable()
export class TraineesService {
  constructor(
    @InjectRepository(Trainee)
    private traineesRepository: Repository<Trainee>,
    private currentUserService: CurrentUserService,
  ) {}

  async findAll() {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();

    const users = await this.traineesRepository.find({
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

    const user = await this.traineesRepository.findOne({
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
