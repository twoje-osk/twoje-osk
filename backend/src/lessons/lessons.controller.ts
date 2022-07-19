import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CancelLessonForInstructorResponseDTO,
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
  GetMyLessonsQueryDTO,
  GetMyLessonsResponseDTO,
  UpdateLessonForInstructorRequestDTO,
  UpdateLessonForInstructorResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { assertNever } from 'utils/assertNever';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get()
  @ApiResponse({
    type: GetMyLessonsResponseDTO,
  })
  @Roles(UserRole.Trainee)
  async getMyLessons(
    @Query() query: GetMyLessonsQueryDTO,
  ): Promise<GetMyLessonsResponseDTO> {
    const from = query.from ?? startOfWeek(new Date());
    const to = query.to ?? endOfWeek(new Date());

    const currentUser = this.currentUserService.getRequestCurrentUser();

    const lessons = await this.lessonsService.findAllByTrainee(
      currentUser.userId,
      from,
      to,
    );

    return {
      lessons,
    };
  }

  @Post('instructor/:instructorId')
  @ApiResponse({
    type: CreateLessonForInstructorResponseDTO,
  })
  @Roles(UserRole.Trainee)
  async createLessonForInstructor(
    @Param('instructorId', ParseIntPipe) instructorId: number,
    @Body() body: CreateLessonForInstructorRequestDTO,
  ): Promise<CreateLessonForInstructorResponseDTO> {
    const currentUser = this.currentUserService.getRequestCurrentUser();

    const createTraineeLessonCall =
      await this.lessonsService.createTraineeLesson(
        instructorId,
        currentUser.userId,
        body.from,
        body.to,
      );

    if (createTraineeLessonCall.ok === true) {
      return {
        createdLessonId: createTraineeLessonCall.data,
      };
    }

    const { error } = createTraineeLessonCall;
    if (error === 'TRAINEE_DOES_NOT_EXIST') {
      throw new NotFoundException("Trainee with provided id doesn't exist");
    }

    if (error === 'INSTRUCTOR_DOES_NOT_EXIST') {
      throw new NotFoundException("Instructor with provided id doesn't exist");
    }

    if (error === 'COLLIDING_LESSON') {
      throw new ConflictException(
        'Lesson for that time has already been scheduled',
      );
    }

    if (error === 'INSTRUCTOR_OCCUPIED') {
      throw new ConflictException('Instructor is occupied at that time');
    }

    return assertNever(error);
  }

  @Patch(':lessonId')
  @ApiResponse({
    type: UpdateLessonForInstructorResponseDTO,
  })
  @Roles(UserRole.Trainee)
  async updateLessonForInstructor(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: UpdateLessonForInstructorRequestDTO,
  ): Promise<UpdateLessonForInstructorResponseDTO> {
    const createTraineeLessonCall =
      await this.lessonsService.updateTraineeLesson(
        lessonId,
        body.from,
        body.to,
      );

    if (createTraineeLessonCall.ok === true) {
      return {};
    }

    const { error } = createTraineeLessonCall;
    if (error === 'LESSON_DOES_NOT_EXIST') {
      throw new NotFoundException("Lesson with provided id doesn't exist");
    }

    if (error === 'LESSON_CANNOT_BE_UPDATED') {
      throw new UnprocessableEntityException('This lesson cannot be updated');
    }

    if (error === 'TRAINEE_DOES_NOT_EXIST') {
      throw new NotFoundException("Trainee with provided id doesn't exist");
    }

    if (error === 'INSTRUCTOR_DOES_NOT_EXIST') {
      throw new NotFoundException("Instructor with provided id doesn't exist");
    }

    if (error === 'COLLIDING_LESSON') {
      throw new ConflictException(
        'Lesson for that time has already been scheduled',
      );
    }

    if (error === 'INSTRUCTOR_OCCUPIED') {
      throw new ConflictException('Instructor is occupied at that time');
    }

    return assertNever(error);
  }

  @Patch(':lessonId/cancel')
  @ApiResponse({
    type: CancelLessonForInstructorResponseDTO,
  })
  @Roles(UserRole.Trainee)
  async cancelLessonForInstructor(
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<CancelLessonForInstructorResponseDTO> {
    const createTraineeLessonCall =
      await this.lessonsService.cancelTraineeLesson(lessonId);

    if (createTraineeLessonCall.ok === true) {
      return {};
    }

    const { error } = createTraineeLessonCall;
    if (error === 'LESSON_DOES_NOT_EXIST') {
      throw new NotFoundException("Lesson with provided id doesn't exist");
    }

    if (error === 'LESSON_CANNOT_BE_UPDATED') {
      throw new UnprocessableEntityException('This lesson cannot be updated');
    }

    return assertNever(error);
  }
}
