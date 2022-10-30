import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Trainee } from 'trainees/entities/trainee.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { getFailure, getSuccess, Try } from 'types/Try';
import { Payment } from './entities/payment.entity';
import { PaymentArguments, PaymentArgumentsUpdate } from './payments.types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Trainee)
    private traineesRepository: Repository<Trainee>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
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
    });

    return payments;
  }

  async findAllByTrainee(traineeId: number) {
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
      relations: {
        trainee: { user: true },
      },
    });

    return payments;
  }

  async findAllPersonalPayments() {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const { userId } = this.currentUserService.getRequestCurrentUser();

    const payments = await this.paymentsRepository.find({
      where: {
        trainee: {
          user: {
            id: userId,
            organizationId,
          },
        },
      },
      relations: {
        trainee: { user: true },
      },
    });

    return payments;
  }

  @Transactional()
  async findOneById(
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

  @Transactional()
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

  @Transactional()
  async create(
    payment: PaymentArguments,
  ): Promise<Try<Payment, 'TRAINEE_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const findTraineeCall = await this.traineesRepository.findOne({
      where: {
        id: payment.idTrainee,
        user: {
          organizationId,
        },
      },
      relations: {
        user: true,
      },
    });

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

  @Transactional()
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
        traineeId: payment.idTrainee,
      },
    );

    return getSuccess(undefined);
  }

  // EDITPAYMENT

  // REMOVEPAYMENT
}
