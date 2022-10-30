import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { DtoTrainee } from '../trainee/trainee.dto';

export class DtoPayment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: ApiDate;

  @ApiProperty()
  trainee: DtoTrainee;
}

export class CreatePaymentDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: ApiDate;

  @ApiProperty()
  traineeId: number;
}

export class UpdatePaymentDto extends OmitType(PartialType(CreatePaymentDto), [
  'traineeId',
]) {}

export class PaymentFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoPayment,
  })
  payments: DtoPayment[];
}

export class PaymentFindOneResponseDto {
  @ApiProperty({
    type: DtoPayment,
  })
  payment: DtoPayment;
}

export class PaymentUpdateResponseDto {}
