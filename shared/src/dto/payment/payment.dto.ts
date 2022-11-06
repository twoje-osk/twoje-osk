import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { DtoTrainee } from '../trainee/trainee.dto';

export class DtoPayment {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => DtoTrainee)
  trainee: DtoTrainee;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
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
