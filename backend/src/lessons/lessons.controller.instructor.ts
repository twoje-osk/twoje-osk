import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CreateLessonRequestDTO,
  CreateLessonResponseDTO,
  GetMyLessonsQueryDTO,
  GetMyLessonsResponseDTO,
  UpdateLessonRequestDTO,
  UpdateLessonResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { assertNever } from 'utils/assertNever';
import { LessonsService } from './lessons.service';

@Roles(UserRole.Instructor)
@Controller('instructor/lessons')
export class InstructorLessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get()
  @ApiResponse({
    type: GetMyLessonsResponseDTO,
  })
  async getMyLessons(
    @Query() query: GetMyLessonsQueryDTO,
  ): Promise<GetMyLessonsResponseDTO> {
    const from = query.from ?? startOfWeek(new Date());
    const to = query.to ?? endOfWeek(new Date());

    const currentUser = this.currentUserService.getRequestCurrentUser();

    const lessons = await this.lessonsService.findAllByInstructorUserId(
      currentUser.userId,
      from,
      to,
    );

    return {
      lessons,
    };
  }

  @Post()
  @ApiResponse({
    type: CreateLessonRequestDTO,
  })
  async createLesson(
    @Body() { from, to, status, traineeId }: CreateLessonRequestDTO,
  ): Promise<CreateLessonResponseDTO> {
    const result = await this.lessonsService.createLesson(
      traineeId,
      from,
      to,
      status,
    );

    if (result.ok) {
      return {
        createdLessonId: result.data,
      };
    }

    const { error } = result;
    if (error === 'TRAINEE_DOES_NOT_EXIST') {
      throw new NotFoundException("Trainee with provided id doesn't exist");
    }

    if (error === 'INSTRUCTOR_DOES_NOT_EXIST') {
      throw new NotFoundException("Instructor with provided id doesn't exist");
    }

    return assertNever(error);
  }

  @Put(':lessonId')
  @ApiResponse({
    type: UpdateLessonRequestDTO,
  })
  async updateLesson(
    @Body() { from, to, status }: UpdateLessonRequestDTO,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<UpdateLessonResponseDTO> {
    const result = await this.lessonsService.updateLesson(
      lessonId,
      from,
      to,
      status,
    );

    if (!result.ok && result.error === 'LESSON_NOT_FOUND') {
      throw new NotFoundException("Lesson with provided id doesn't exist");
    }

    return {};
  }
}
