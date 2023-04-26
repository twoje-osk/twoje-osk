import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserService } from '../current-user/current-user.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { TraineesService } from '../trainees/trainees.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { Payment } from './entities/payment.entity';
import { PaymentArguments, PaymentArgumentsUpdate } from './payments.types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
    private traineesService: TraineesService,
  ) {}

  async findAll() {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const payments = await this.paymentsRepository.find({
      where: {
        trainee: {
          user: {
            organizationId,
          },
        },
      },
      relations: {
        trainee: { user: true },
      },
      order: {
        date: 'DESC',
      },
    });

    return payments;
  }

  async findAllByTraineeId(traineeId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const payments = await this.paymentsRepository.find({
      where: {
        trainee: {
          id: traineeId,
          user: {
            organizationId,
          },
        },
      },
      order: {
        date: 'DESC',
      },
    });

    return payments;
  }

  async findAllByUserId(traineeId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const payments = await this.paymentsRepository.find({
      where: {
        trainee: {
          user: {
            organizationId,
            id: traineeId,
          },
        },
      },
      order: {
        date: 'DESC',
      },
    });

    return payments;
  }

  @TransactionalWithTry()
  async findOneById(
    paymentId: number,
    userId?: number,
    includeTrainee = false,
  ): Promise<Try<Payment, 'PAYMENT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const payment = await this.paymentsRepository.findOne({
      where: {
        id: paymentId,
        trainee: {
          user: { id: userId, organizationId },
        },
      },
      relations: !includeTrainee
        ? undefined
        : {
            trainee: { user: true },
          },
    });

    if (payment === null) {
      return getFailure('PAYMENT_NOT_FOUND');
    }
    return getSuccess(payment);
  }

  @TransactionalWithTry()
  async findOnePersonalPayment(
    paymentId: number,
  ): Promise<Try<Payment, 'PAYMENT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const { userId } = this.currentUserService.getRequestCurrentUser();

    const payment = await this.paymentsRepository.findOne({
      where: {
        id: paymentId,
        trainee: {
          user: { id: userId, organizationId },
        },
      },
    });

    if (payment === null) {
      return getFailure('PAYMENT_NOT_FOUND');
    }
    return getSuccess(payment);
  }

  @TransactionalWithTry()
  async create(
    payment: PaymentArguments,
  ): Promise<Try<Payment, 'TRAINEE_NOT_FOUND'>> {
    const findTraineeCall = await this.traineesService.findOneById(
      payment.idTrainee,
    );

    if (findTraineeCall === null) {
      return getFailure('TRAINEE_NOT_FOUND');
    }

    const createPaymentCall = await this.paymentsRepository.create({
      amount: payment.amount,
      date: payment.date,
      trainee: findTraineeCall,
    });

    await this.paymentsRepository.save(createPaymentCall);

    return getSuccess(createPaymentCall);
  }

  @TransactionalWithTry()
  async update(
    paymentId: number,
    payment: PaymentArgumentsUpdate,
  ): Promise<Try<undefined, 'PAYMENT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const findPaymentCall = await this.paymentsRepository.findOne({
      where: {
        id: paymentId,
        trainee: { user: { organizationId } },
      },
      relations: {
        trainee: true,
      },
    });

    if (findPaymentCall === null) {
      return getFailure('PAYMENT_NOT_FOUND');
    }

    await this.paymentsRepository.update(
      { id: paymentId },
      {
        amount: payment.amount,
        date: payment.date,
        note: payment.note,
      },
    );

    return getSuccess(undefined);
  }

  @TransactionalWithTry()
  async delete(
    paymentId: number,
  ): Promise<Try<undefined, 'PAYMENT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const findPaymentCall = await this.paymentsRepository.findOne({
      where: {
        id: paymentId,
        trainee: { user: { organizationId } },
      },
      relations: {
        trainee: true,
      },
    });

    if (findPaymentCall === null) {
      return getFailure('PAYMENT_NOT_FOUND');
    }

    await this.paymentsRepository.delete({ id: paymentId });

    return getSuccess(undefined);
  }
}
