import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

interface VehicleArguments {
  licensePlate?: string;
  notes: string | null;
}

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private currentUserService: CurrentUserService,
  ) {}

  async findAll(): Promise<Vehicle[]> {
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
    const numberOfFoundVehicles = await this.vehiclesRepository.countBy({
      licensePlate,
      organization: { id: organizationId },
    });
    return numberOfFoundVehicles > 0;
  }

  async create(licensePlate: string, notes: string | null) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const newVehicle = this.vehiclesRepository.create({
      licensePlate,
      notes,
      organization: { id: organizationId },
    });

    await this.vehiclesRepository.save(newVehicle);

    return newVehicle;
  }

  async update(vehicle: Partial<VehicleArguments>, vehicleId: number) {
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

  async delete(vehicleId: number) {
    const { organizationId } = this.currentUserService.getRequestCurrentUser();
    const deletedVehicle = this.vehiclesRepository.delete({
      id: vehicleId,
      organization: { id: organizationId },
    });

    return deletedVehicle;
  }
}
