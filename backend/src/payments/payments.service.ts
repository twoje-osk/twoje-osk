import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CurrentUserService } from '../current-user/current-user.service';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { TraineesService } from '../trainees/trainees.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { DateBetweenProperty } from '../utils/DateBetweenProperty';
import { getLimitArguments } from '../utils/presentationArguments';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { Payment } from './entities/payment.entity';
import {
  PaymentArguments,
  PaymentArgumentsUpdate,
  PaymentPresentationArguments,
  PaymentPresentationFilterArguments,
  PaymentPresentationSortArguments,
} from './payments.types';
import { isPaymentSortField } from './payments.utils';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private organizationDomainService: OrganizationDomainService,
    private currentUserService: CurrentUserService,
    private traineesService: TraineesService,
  ) {}

  private buildOrderOption(
    sortArguments: PaymentPresentationSortArguments | undefined,
  ): FindManyOptions<Payment>['order'] {
    const sortOrder = sortArguments?.sortOrder ?? 'desc';

    const defaultSortOrder = {
      date: sortOrder,
    };

    if (sortArguments?.sortBy === undefined) {
      return defaultSortOrder;
    }

    if (isPaymentSortField(sortArguments.sortBy)) {
      return {
        [sortArguments.sortBy]: sortOrder,
      };
    }

    return defaultSortOrder;
  }

  private buildWhereOption(
    filterArguments: PaymentPresentationFilterArguments | undefined,
    organizationId: number,
    traineeId?: number,
    userId?: number,
  ): FindOptionsWhere<Payment> {
    const dateProperty = DateBetweenProperty(
      filterArguments?.dateFrom,
      filterArguments?.dateTo,
    );

    const noteProperty =
      filterArguments?.note !== undefined
        ? ILike(`%${filterArguments.note}%`)
        : undefined;

    const firstNameProperty =
      filterArguments?.firstName !== undefined
        ? ILike(`%${filterArguments.firstName}%`)
        : undefined;

    const lastNameProperty =
      filterArguments?.lastName !== undefined
        ? ILike(`%${filterArguments.lastName}%`)
        : undefined;

    return {
      date: dateProperty,
      note: noteProperty,
      trainee: {
        user: {
          firstName: firstNameProperty,
          lastName: lastNameProperty,
          organizationId,
          id: userId,
        },
        id: traineeId,
      },
    };
  }

  async findAll(presentationArguments?: PaymentPresentationArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [payments, count] = await this.paymentsRepository.findAndCount({
      ...limitArguments,
      order: this.buildOrderOption(presentationArguments?.sort),
      where: this.buildWhereOption(
        presentationArguments?.filter,
        organizationId,
      ),
    });

    return { payments, count };
  }

  async findAllByTraineeId(
    traineeId: number,
    presentationArguments?: PaymentPresentationArguments,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [payments, count] = await this.paymentsRepository.findAndCount({
      ...limitArguments,
      order: this.buildOrderOption(presentationArguments?.sort),
      where: this.buildWhereOption(
        presentationArguments?.filter,
        organizationId,
        traineeId,
      ),
    });

    return { payments, count };
  }

  async findAllByUserId(
    userId: number,
    presentationArguments?: PaymentPresentationArguments,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [payments, count] = await this.paymentsRepository.findAndCount({
      ...limitArguments,
      order: this.buildOrderOption(presentationArguments?.sort),
      where: this.buildWhereOption(
        presentationArguments?.filter,
        organizationId,
        undefined,
        userId,
      ),
    });

    return { payments, count };
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
