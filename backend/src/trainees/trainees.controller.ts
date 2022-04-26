import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
} from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';
import { TraineesService } from './trainees.service';

@Controller('trainees')
export class TraineesController {
  constructor(private readonly traineesService: TraineesService) {}

  @ApiResponse({
    type: TraineeFindAllResponseDto,
  })
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() { user }: AuthRequest) {
    const trainees = await this.traineesService.findAll(user.organizationId);

    return { trainees };
  }

  @ApiResponse({
    type: TraineeFindOneResponseDto,
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() { user }: AuthRequest,
  ): Promise<TraineeFindOneResponseDto> {
    const trainee = await this.traineesService.findOne(
      +id,
      user.organizationId,
    );

    if (trainee === null) {
      throw new NotFoundException();
    }

    return { trainee };
  }
}
