import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  PaymentFindAllResponseDto,
  PaymentFindOneResponseDto,
  PaymentUpdateResponseDto,
  PaymentUpdateRequestDto,
  UserRole,
  PaymentFindAllByTraineeResponseDto,
  PaymentDeleteResponseDto,
  PaymentCreateResponseDto,
  PaymentCreateRequestDto,
  PaymentMyFindAllResponseDto,
  PaymentFindAllQueryDto,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { CurrentUserService } from '../current-user/current-user.service';
import { assertNever } from '../utils/assertNever';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentFindAllResponseDto,
  })
  @Get()
  async findAll(
    @Query() query: PaymentFindAllQueryDto,
  ): Promise<PaymentFindAllResponseDto> {
    const { payments, count } = await this.paymentsService.findAll({
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
      sort: {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      filter: query.filters ?? {},
    });
    return { payments, total: count };
  }

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentFindAllByTraineeResponseDto,
  })
  @Get('trainees/:traineeId')
  async findAllByTraineeId(
    @Param('traineeId', ParseIntPipe) traineeId: number,
    @Query() query: PaymentFindAllQueryDto,
  ): Promise<PaymentFindAllByTraineeResponseDto> {
    const { payments, count } = await this.paymentsService.findAllByTraineeId(
      traineeId,
      {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
        },
        sort: {
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        },
        filter: query.filters ?? {},
      },
    );
    return { payments, total: count };
  }

  @Roles(UserRole.Trainee, UserRole.Admin)
  @ApiResponse({
    type: PaymentMyFindAllResponseDto,
  })
  @Get('my')
  async findAllForCurrentUser(
    @Query() query: PaymentFindAllQueryDto,
  ): Promise<PaymentMyFindAllResponseDto> {
    const { userId } = this.currentUserService.getRequestCurrentUser();

    const { payments, count } = await this.paymentsService.findAllByUserId(
      userId,
      {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
        },
        sort: {
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        },
        filter: query.filters ?? {},
      },
    );
    return { payments, total: count };
  }

  @Roles(UserRole.Trainee)
  @ApiResponse({
    type: PaymentFindOneResponseDto,
  })
  @Get('my/:paymentId')
  async findOnePersonalPayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<PaymentFindOneResponseDto> {
    const loggedUser = this.currentUserService.getRequestCurrentUser();
    const payment = await this.paymentsService.findOneById(
      paymentId,
      loggedUser.userId,
    );

    if (payment.ok) {
      return { payment: payment.data };
    }

    if (payment.error === 'PAYMENT_NOT_FOUND') {
      throw new NotFoundException('Payment with this ID does not exist.');
    }

    return assertNever(payment.error);
  }

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentCreateResponseDto,
  })
  @Post()
  async createPayment(
    @Body() body: PaymentCreateRequestDto,
  ): Promise<PaymentCreateResponseDto> {
    const createResult = await this.paymentsService.create(body);

    if (createResult.ok) {
      return { payment: createResult.data };
    }

    if (createResult.error === 'TRAINEE_NOT_FOUND') {
      throw new NotFoundException('Trainee with this ID does not exist.');
    }

    return assertNever(createResult.error);
  }

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentUpdateResponseDto,
  })
  @Patch(':paymentId')
  async editPayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() body: PaymentUpdateRequestDto,
  ): Promise<PaymentUpdateResponseDto> {
    const updateResult = await this.paymentsService.update(paymentId, body);

    if (updateResult.ok) {
      return { payment: updateResult.data };
    }

    if (updateResult.error === 'PAYMENT_NOT_FOUND') {
      throw new NotFoundException('Payment with this ID does not exist.');
    }

    return assertNever(updateResult.error);
  }

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentFindOneResponseDto,
  })
  @Get(':paymentId')
  async findOne(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<PaymentFindOneResponseDto> {
    const payment = await this.paymentsService.findOneById(
      paymentId,
      undefined,
      true,
    );

    if (payment.ok) {
      return { payment: payment.data };
    }

    if (payment.error === 'PAYMENT_NOT_FOUND') {
      throw new NotFoundException('Payment with this ID does not exist.');
    }

    return assertNever(payment.error);
  }

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: PaymentDeleteResponseDto,
  })
  @Delete(':paymentId')
  async delete(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<PaymentDeleteResponseDto> {
    const result = await this.paymentsService.delete(paymentId);

    if (result.ok) {
      return {};
    }

    if (result.error === 'PAYMENT_NOT_FOUND') {
      throw new NotFoundException('Payment with this ID does not exist.');
    }

    return assertNever(result.error);
  }
}
