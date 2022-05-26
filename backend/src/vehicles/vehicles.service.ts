import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

interface VehicleArguments {
  licensePlate?: string;
  notes?: string;
}

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private currentUserService: CurrentUserService,
  ) {}

  async getAll(): Promise<Vehicle[]> {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    return this.vehiclesRepository.find({
      where: {
        organization: { id: organizationId },
      },
      relations: {
        organization: true,
      },
    });
  }

  async findOneById(id: number) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    return this.vehiclesRepository.findOne({
      where: {
        id,
        organization: { id: organizationId },
      },
      relations: {
        organization: true,
      },
    });
  }

  async checkIfExistsByLicensePlate(licensePlate: string) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    return (
      (await this.vehiclesRepository.countBy({
        licensePlate,
        organization: { id: organizationId },
      })) > 0
    );
  }

  // create
  async create(licensePlate: string, notes: string | undefined) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const newVehicle = this.vehiclesRepository.create({
      licensePlate,
      notes,
      organization: { id: organizationId },
    });

    await this.vehiclesRepository.save(newVehicle);

    return newVehicle;
  }

  // update
  async update(vehicle: VehicleArguments, vehicleId: number) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const updatedVehicle = this.vehiclesRepository.update(
      {
        id: vehicleId,
        organization: { id: organizationId },
      },
      vehicle,
    );
    return updatedVehicle;
  }
}
