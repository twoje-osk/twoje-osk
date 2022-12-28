import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  UserRole,
  MockExamAttemptFindAllResponseDto,
  MockExamAttemptFindOneResponseDto,
  MockExamAttemptSubmitResponseDto,
  MockExamAttemptSubmitRequestDto,
} from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';
import { Roles } from 'common/guards/roles.decorator';

@Controller('exams')
@Roles(UserRole.Trainee)
export class MockExamAttemptController {
  constructor(
    private readonly mockExamAttemptsService: MockExamAttemptsService,
  ) {}

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
  })
  @Get('user/:id')
  async findAllAttemptsOfUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const examAttempts =
      await this.mockExamAttemptsService.findAllAttemptsOfUser(id);

    return { examAttempts };
  }

  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
  })
  @Get()
  async findAllMyAttempts(
    @Request() request: AuthRequest,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const { userId: id } = request.user;
    const examAttempts =
      await this.mockExamAttemptsService.findAllAttemptsOfUser(id);
    return { examAttempts };
  }

  @ApiResponse({
    type: MockExamAttemptFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamAttemptFindOneResponseDto> {
    const examAttempt = await this.mockExamAttemptsService.findOne(id);
    return { examAttempt };
  }

  @ApiResponse({
    type: MockExamAttemptSubmitResponseDto,
  })
  @Post()
  async submit(
    @Body() { attempt }: MockExamAttemptSubmitRequestDto,
  ): Promise<MockExamAttemptSubmitResponseDto> {
    const examAttemptId = await this.mockExamAttemptsService.create(attempt);
    return { id: examAttemptId };
  }
}
