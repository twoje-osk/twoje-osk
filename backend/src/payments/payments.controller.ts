import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  PaymentFindAllResponseDto,
  PaymentFindOneResponseDto,
  PaymentUpdateResponseDto,
  PaymentUpdateRequestDto,
  UserRole,
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
  async findAll(): Promise<PaymentFindAllResponseDto> {
    const payments = await this.paymentsService.findAll();

    return { payments };
  }

  @Roles(UserRole.Trainee)
  @ApiResponse({
    type: PaymentFindAllResponseDto,
  })
  @Get('my')
  async findAllByTrainee(): Promise<PaymentFindAllResponseDto> {
    const loggedUser = this.currentUserService.getRequestCurrentUser();

    const payments = await this.paymentsService.findAllByTrainee(
      loggedUser.userId,
    );

    return { payments };
  }

  @Roles(UserRole.Trainee)
  @ApiResponse({
    type: PaymentFindOneResponseDto,
  })
  @Get('my/:id')
  async findOnePersonalPayment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentFindOneResponseDto> {
    const loggedUser = this.currentUserService.getRequestCurrentUser();
    const payment = await this.paymentsService.findOneById(
      id,
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
    type: PaymentUpdateResponseDto,
  })
  @Patch(':id')
  async editPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PaymentUpdateRequestDto,
  ): Promise<PaymentUpdateResponseDto> {
    const updateResult = await this.paymentsService.update(id, body);

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
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentFindOneResponseDto> {
    const payment = await this.paymentsService.findOneById(id);

    if (payment.ok) {
      return { payment: payment.data };
    }

    if (payment.error === 'PAYMENT_NOT_FOUND') {
      throw new NotFoundException('Payment with this ID does not exist.');
    }

    return assertNever(payment.error);
  }
}
