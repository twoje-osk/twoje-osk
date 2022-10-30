import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainee } from 'trainees/entities/trainee.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([Trainee, Payment])],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
