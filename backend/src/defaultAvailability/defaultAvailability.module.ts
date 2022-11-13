import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorsModule } from 'instructors/instructors.module';
import { DefaultAvailabilityService } from './defaultAvailability.service';
import { DefaultAvailabilityController } from './defaultAvailability.controller';
import { DefaultAvailability } from './entities/defaultAvailability.entity';

@Module({
  controllers: [DefaultAvailabilityController],
  providers: [DefaultAvailabilityService],
  imports: [TypeOrmModule.forFeature([DefaultAvailability]), InstructorsModule],
  exports: [DefaultAvailabilityService],
})
export class DefaultAvailabilityModule {}
