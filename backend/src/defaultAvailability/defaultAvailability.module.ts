import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultAvailabilityService } from './defaultAvailability.service';
import { DefaultAvailabilityController } from './defaultAvailability.controller';
import { DefaultAvailability } from './entities/defaultAvailability.entity';
import { InstructorsModule } from '../instructors/instructors.module';

@Module({
  controllers: [DefaultAvailabilityController],
  providers: [DefaultAvailabilityService],
  imports: [TypeOrmModule.forFeature([DefaultAvailability]), InstructorsModule],
  exports: [DefaultAvailabilityService],
})
export class DefaultAvailabilityModule {}
