import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
  GetMyLessonsQueryDTO,
  GetMyLessonsResponseDTO,
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
        body.vehicleId,
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

    if (error === 'VEHICLE_DOES_NOT_EXIST') {
      throw new NotFoundException("Vehicle with provided id doesn't exist");
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
}
