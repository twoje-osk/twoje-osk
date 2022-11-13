import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorDefaultAvailabilityResponseDTO,
  InstructorCreateDefaultAvailabilityRequestDTO,
  InstructorCreateDefaultAvailabilityResponseDTO,
  InstructorUpdateDefaultAvailabilityRequestDTO,
  InstructorUpdateDefaultAvailabilityResponseDTO,
  InstructorDeleteDefaultAvailabilityResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { assertNever } from 'utils/assertNever';
import { DefaultAvailabilityService } from './defaultAvailability.service';

@Controller('default-availability')
@Roles(UserRole.Instructor)
export class DefaultAvailabilityController {
  constructor(
    private readonly availabilityService: DefaultAvailabilityService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @ApiResponse({
    type: InstructorDefaultAvailabilityResponseDTO,
  })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyAvailability(): Promise<InstructorDefaultAvailabilityResponseDTO> {
    const user = this.currentUserService.getRequestCurrentUser();

    const availabilities =
      await this.availabilityService.getAvailabilitiesByInstructorUserId(
        user.userId,
      );

    return { availabilities };
  }

  @ApiResponse({
    type: InstructorCreateDefaultAvailabilityResponseDTO,
  })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAvailability(
    @Body() body: InstructorCreateDefaultAvailabilityRequestDTO,
  ): Promise<InstructorCreateDefaultAvailabilityResponseDTO> {
    const { from, to, dayOfWeek } = body.availability;

    const newAvailability = await this.availabilityService.createAvailability(
      from,
      to,
      dayOfWeek,
    );

    if (newAvailability.ok) {
      return { createdAvailabilityId: newAvailability.data };
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'COLLIDING_AVAILABILITY') {
      throw new ConflictException(
        'There is availability already in that time slot',
      );
    }

    return assertNever(newAvailability.error);
  }

  @ApiResponse({
    type: InstructorUpdateDefaultAvailabilityResponseDTO,
  })
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateAvailability(
    @Body() body: InstructorUpdateDefaultAvailabilityRequestDTO,
    @Param('id', ParseIntPipe) instructorId: number,
  ): Promise<InstructorUpdateDefaultAvailabilityResponseDTO> {
    const { from, to, dayOfWeek } = body.availability;

    const newAvailability = await this.availabilityService.updateAvailability(
      instructorId,
      from,
      to,
      dayOfWeek,
    );

    if (newAvailability.ok) {
      return {};
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'AVAILABILITY_NOT_FOUND') {
      throw new NotFoundException('Specified availability was not found');
    }

    if (newAvailability.error === 'COLLIDING_AVAILABILITY') {
      throw new ConflictException(
        'There is availability already in that time slot',
      );
    }

    return assertNever(newAvailability.error);
  }

  @ApiResponse({
    type: InstructorDeleteDefaultAvailabilityResponseDTO,
  })
  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteAvailability(
    @Param('id', ParseIntPipe) instructorId: number,
  ): Promise<InstructorDeleteDefaultAvailabilityResponseDTO> {
    const newAvailability = await this.availabilityService.deleteAvailability(
      instructorId,
    );

    if (newAvailability.ok) {
      return {};
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'AVAILABILITY_NOT_FOUND') {
      throw new NotFoundException('Specified availability was not found');
    }

    return assertNever(newAvailability.error);
  }
}
