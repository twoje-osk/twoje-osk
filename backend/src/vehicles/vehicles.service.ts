import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
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

  async findOneById(id: number): Promise<Try<Vehicle, 'VEHICLE_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();
    const vehicleToFind = await this.vehiclesRepository.findOne({
      where: {
        id,
        organization: { id: organizationId },
      },
    });

    if (vehicleToFind === null) {
      return getFailure('VEHICLE_NOT_FOUND');
    }

    return getSuccess(vehicleToFind);
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
  ): Promise<Try<Vehicle, 'VEHICLE_SAME_LICENSE_PLATE'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const existsVehicleWithSameLicensePlate =
      await this.vehiclesRepository.countBy({
        licensePlate,
        organization: { id: organizationId },
      });

    if (existsVehicleWithSameLicensePlate > 0) {
      return getFailure('VEHICLE_SAME_LICENSE_PLATE');
    }

    const vehicleToCreate = this.vehiclesRepository.create({
      name,
      licensePlate,
      vin,
      dateOfNextCheck,
      photo,
      additionalDetails,
      notes,
      organization: { id: organizationId },
    });

    await this.vehiclesRepository.save(vehicleToCreate);

    return getSuccess(vehicleToCreate);
  }

  async update(
    vehicle: Partial<VehicleArguments>,
    vehicleId: number,
  ): Promise<
    Try<undefined, 'VEHICLE_NOT_FOUND' | 'VEHICLE_SAME_LICENSE_PLATE'>
  > {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const vehicleToEdit = await this.vehiclesRepository.findOne({
      where: {
        id: vehicleId,
        organization: { id: organizationId },
      },
    });

    if (vehicleToEdit === null) {
      return getFailure('VEHICLE_NOT_FOUND');
    }

    const existsVehicleWithSameLicensePlate =
      await this.vehiclesRepository.countBy({
        id: Not(vehicleId),
        licensePlate: vehicle.licensePlate,
        organization: { id: organizationId },
      });

    if (existsVehicleWithSameLicensePlate > 0) {
      return getFailure('VEHICLE_SAME_LICENSE_PLATE');
    }

    await this.vehiclesRepository.update(
      {
        id: vehicleId,
        organization: { id: organizationId },
      },
      vehicle,
    );
    return getSuccess(undefined);
  }

  async remove(
    vehicleId: number,
  ): Promise<Try<undefined, 'VEHICLE_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const vehicleToEdit = await this.vehiclesRepository.findOne({
      where: {
        id: vehicleId,
        organization: { id: organizationId },
      },
    });

    if (vehicleToEdit === null) {
      return getFailure('VEHICLE_NOT_FOUND');
    }

    this.vehiclesRepository.delete({
      id: vehicleId,
      organization: { id: organizationId },
    });

    return getSuccess(undefined);
  }
}
