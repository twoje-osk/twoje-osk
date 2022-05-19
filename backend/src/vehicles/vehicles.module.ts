import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  providers: [VehicleService],
  exports: [VehicleService],
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
