import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TraineesService } from 'trainees/trainees.service';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { getFailure, getSuccess, Try } from 'types/Try';
import { MockExamAttempt } from './entities/mockExamAttempt.entity';

@Injectable()
export class MockExamAttemptsService {
  constructor(
    @InjectRepository(MockExamAttempt)
    private mockExamAttemptRepository: Repository<MockExamAttempt>,
    private traineeService: TraineesService,
    private mockExamQuestionAttemptService: MockExamQuestionAttemptService,
  ) {}

  async findAllAttemptsOfUser(
    id: number,
  ): Promise<Try<MockExamAttempt[], 'TRAINEE_DOES_NOT_EXIST'>> {
    const trainee = await this.traineeService.findOneById(id);
    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }
    const attempts = await this.mockExamAttemptRepository.find({
      where: {
        traineeId: id,
      },
      relations: {
        questions: true,
      },
    });

    return getSuccess(attempts);
  }

  async findOne(
    id: number,
  ): Promise<Try<MockExamAttempt, 'ATTEMPT_DOES_NOT_EXIST'>> {
    const attempt = await this.mockExamAttemptRepository.findOne({
      where: {
        id,
      },
      relations: {
        questions: true,
      },
    });
    if (attempt === null) {
      return getFailure('ATTEMPT_DOES_NOT_EXIST');
    }
    return getSuccess(attempt);
  }

  @Transactional()
  async create(
    attempt: DtoCreateMockExamAttempt,
  ): Promise<MockExamAttemptFindOneResponseDto> {}
}
