import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { VehicleService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  controllers: [VehiclesController],
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleService, CurrentUserService],
})
export class VehiclesModule {}
