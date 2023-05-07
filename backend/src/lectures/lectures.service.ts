import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from './entities/lecture.entity';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private lecturesRepository: Repository<Lecture>,
  ) {}

  async findAll() {
    const lectures = await this.lecturesRepository.find({
      select: ['id', 'index', 'subject'],
      order: {
        index: 'ASC',
      },
    });

    return lectures;
  }

  async findOne(id: number) {
    const lecture = await this.lecturesRepository.findOneBy({ id });
    return lecture;
  }
}
