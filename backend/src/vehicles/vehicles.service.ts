import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserService } from 'current-user/current-user.service';
import { OrganizationDomainService } from 'organization-domain/organization-domain.service';
import { Repository } from 'typeorm';
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
    private currentUserService: CurrentUserService,
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

    return this.vehiclesRepository.findOne({
      where: {
        id,
        organization: { id: organizationId },
      },
    });
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

    const updatedVehicle = this.vehiclesRepository.update(
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
