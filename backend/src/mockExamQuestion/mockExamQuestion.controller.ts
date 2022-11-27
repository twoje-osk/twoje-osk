import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

Controller('questions');
export class MockExamQuestionsController {
  constructor(private readonly MockExamQuestionsService) {}

  @ApiResponse({
    type: MockExamQuestionsGenerateResponseDto,
  })
  @Get('exam/:id')
  async generateExam(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamQuestionsGenerateResponseDto> {}
}
