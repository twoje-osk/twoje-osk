import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { TraineesModule } from '../trainees/trainees.module';

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([Payment]), TraineesModule],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
