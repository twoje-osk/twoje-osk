import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async getAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      relations: {
        organization: true,
      },
    });
  }

  async findOne(id: number) {
    return this.vehiclesRepository.findOne({
      where: {
        id,
      },
      relations: {
        organization: true,
      },
    });
  }
}
