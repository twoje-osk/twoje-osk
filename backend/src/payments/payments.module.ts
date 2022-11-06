import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraineesModule } from 'trainees/trainees.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([Payment]), TraineesModule],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
