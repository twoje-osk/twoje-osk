import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  controllers: [VehiclesController],
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehiclesModule {}
