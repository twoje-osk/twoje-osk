import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MockExamQuestionsGenerateResponseDto, UserRole } from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { assertNever } from '../utils/assertNever';
import { MockExamQuestionService } from './mockExamQuestion.service';

@Controller('questions')
@Roles(UserRole.Trainee)
export class MockExamQuestionsController {
  constructor(
    private readonly mockExamQuestionsService: MockExamQuestionService,
  ) {}

  @ApiResponse({
    type: MockExamQuestionsGenerateResponseDto,
  })
  @Get('exam/:categoryId')
  async generateExam(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<MockExamQuestionsGenerateResponseDto> {
    const questionsFetchResult =
      await this.mockExamQuestionsService.generateExam(categoryId);
    if (questionsFetchResult.ok) {
      return questionsFetchResult.data;
    }
    if (questionsFetchResult.error === 'NO_QUESTION_TYPES_FOUND') {
      throw new NotFoundException();
    }
    return assertNever(questionsFetchResult.error);
  }
}
