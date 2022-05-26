import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private currentUserService: CurrentUserService,
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

  async checkIfExistsByLicensePlate(licensePlate: string) {
    return (
      (await this.vehiclesRepository.countBy({
        licensePlate,
      })) > 0
    );
  }

  async addNew(licensePlate: string, notes: string | undefined) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const newVehicle = this.vehiclesRepository.create({
      licensePlate,
      notes,
      organization: { id: organizationId },
    });

    await this.vehiclesRepository.save(newVehicle);

    return newVehicle;
  }
}
