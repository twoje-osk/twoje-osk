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
  GetLessonByIdResponseDTO,
  GetMyLessonsQueryDTO,
  GetMyLessonsResponseDTO,
  LessonsDTO,
  UpdateLessonForInstructorRequestDTO,
  UpdateLessonForInstructorResponseDTO,
  UserRole,
} from '@osk/shared';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Roles } from '../common/guards/roles.decorator';
import { CurrentUserService } from '../current-user/current-user.service';
import { assertNever } from '../utils/assertNever';
import { LessonsService } from './lessons.service';

@Roles(UserRole.Trainee)
@Controller('trainee/lessons')
export class TraineeLessonsController {
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

    const lessonsData = await this.lessonsService.findAllByTraineeUserId(
      currentUser.userId,
      from,
      to,
    );
    const lessons: LessonsDTO[] = [];
    const lessonsResult: GetMyLessonsResponseDTO = { lessons };
    lessonsData.forEach((lessonData) => {
      const instructor = {
        ...lessonData.instructor,
      };

      const lesson = { ...lessonData, instructor };
      lessonsResult.lessons.push(lesson);
    });

    return lessonsResult;
  }

  @Post('instructor/:instructorId')
  @ApiResponse({
    type: CreateLessonForInstructorResponseDTO,
  })
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

  @Get(':lessonId')
  @ApiResponse({
    type: GetLessonByIdResponseDTO,
  })
  async getLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<GetLessonByIdResponseDTO> {
    const currentUser = this.currentUserService.getRequestCurrentUser();
    const lesson = await this.lessonsService.getById(
      lessonId,
      currentUser.userId,
    );

    if (lesson === null) {
      throw new NotFoundException("Lesson with provided id doesn't exist");
    }

    return { lesson };
  }

  @Patch(':lessonId')
  @ApiResponse({
    type: UpdateLessonForInstructorResponseDTO,
  })
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
