import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository, Not } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

interface VehicleArguments {
  name?: string;
  licensePlate?: string;
  vin?: string;
  dateOfNextCheck?: Date;
  photo: string | null;
  additionalDetails: string | null;
  notes: string | null;
}

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private organizationDomainService: OrganizationDomainService,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    return this.vehiclesRepository.find({
      where: {
        organization: { id: organizationId },
      },
    });
  }

  async findOneById(id: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const vehicle = await this.vehiclesRepository.findOne({
      where: {
        id,
        organization: { id: organizationId },
      },
    });

    if (vehicle === null) {
      throw new Error('VEHICLE_NOT_FOUND');
    }

    return vehicle;
  }

  async checkIfExistsByLicensePlate(licensePlate: string) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const numberOfFoundVehicles = await this.vehiclesRepository.countBy({
      licensePlate,
      organization: { id: organizationId },
    });
    return numberOfFoundVehicles > 0;
  }

  async create(
    name: string,
    licensePlate: string,
    vin: string,
    dateOfNextCheck: Date,
    photo: string | null,
    additionalDetails: string | null,
    notes: string | null,
  ) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const newVehicle = this.vehiclesRepository.create({
      name,
      licensePlate,
      vin,
      dateOfNextCheck,
      photo,
      additionalDetails,
      notes,
      organization: { id: organizationId },
    });

    await this.vehiclesRepository.save(newVehicle);

    return newVehicle;
  }

  async update(vehicle: Partial<VehicleArguments>, vehicleId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const vehicleToEdit = await this.vehiclesRepository.findOne({
      where: {
        id: vehicleId,
        organization: { id: organizationId },
      },
    });

    if (vehicleToEdit === null) {
      throw new Error('VEHICLE_NOT_FOUND');
    }

    const existsVehicleWithSameLicensePlate =
      await this.vehiclesRepository.countBy({
        id: Not(vehicleId),
        licensePlate: vehicle.licensePlate,
        organization: { id: organizationId },
      });

    if (existsVehicleWithSameLicensePlate > 0) {
      throw new Error('VEHICLE_SAME_LICENSE_PLATE');
    }

    if (vehicle.vin !== undefined && vehicle.vin?.length !== 17) {
      throw new Error('VIN_LENGTH_NOT_CORRECT');
    }

    const updatedVehicle = await this.vehiclesRepository.update(
      {
        id: vehicleId,
        organization: { id: organizationId },
      },
      vehicle,
    );
    return updatedVehicle;
  }

  async remove(vehicleId: number) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const removedVehicle = this.vehiclesRepository.delete({
      id: vehicleId,
      organization: { id: organizationId },
    });

    return removedVehicle;
  }
}
