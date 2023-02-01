import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { InstructorsModule } from '../instructors/instructors.module';
import { VehiclesFavouritesController } from './vehicles.favourites.controller';

@Module({
  controllers: [VehiclesFavouritesController, VehiclesController],
  imports: [TypeOrmModule.forFeature([Vehicle]), InstructorsModule],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehiclesModule {}
