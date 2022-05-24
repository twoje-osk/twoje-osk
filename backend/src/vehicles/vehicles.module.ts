import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { CurrentUserModule } from 'current-user/current-user.module';
import { VehicleService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  controllers: [VehiclesController],
  imports: [TypeOrmModule.forFeature([Vehicle]), CurrentUserModule],
  providers: [VehicleService, CurrentUserService],
  exports: [VehicleService],
})
export class VehiclesModule {}
