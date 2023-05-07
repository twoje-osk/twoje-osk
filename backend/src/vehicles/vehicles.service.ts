import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Not,
  FindManyOptions,
  ILike,
  FindOptionsWhere,
} from 'typeorm';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { getLimitArguments } from '../utils/presentationArguments';
import { Vehicle } from './entities/vehicle.entity';
import {
  VehicleArguments,
  VehiclePresentationArguments,
  VehiclePresentationFilterArguments,
  VehiclePresentationSortArguments,
} from './vehicles.types';
import { isVehicleSortField } from './vehicles.utils';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private organizationDomainService: OrganizationDomainService,
  ) {}

  private buildOrderOption(
    sortArguments: VehiclePresentationSortArguments | undefined,
  ): FindManyOptions<Vehicle>['order'] {
    const sortOrder = sortArguments?.sortOrder ?? 'desc';

    const defaultSortOrder = {
      licensePlate: sortOrder,
    };

    if (sortArguments?.sortBy === undefined) {
      return defaultSortOrder;
    }

    if (isVehicleSortField(sortArguments.sortBy)) {
      return {
        [sortArguments.sortBy]: sortOrder,
      };
    }

    return defaultSortOrder;
  }

  private buildWhereOption(
    filterArguments: VehiclePresentationFilterArguments | undefined,
    organizationId: number,
  ): FindOptionsWhere<Vehicle> {
    const nameProperty =
      filterArguments?.name !== undefined
        ? ILike(`%${filterArguments.name}%`)
        : undefined;

    const licensePlateProperty =
      filterArguments?.licensePlate !== undefined
        ? ILike(`%${filterArguments.licensePlate}%`)
        : undefined;

    const vinProperty =
      filterArguments?.vin !== undefined
        ? ILike(`%${filterArguments.vin}%`)
        : undefined;

    // TODO Add filtering between date A and date B
    // const dateOfNextCheckProperty =
    //   filterArguments?.dateOfNextCheck !== undefined
    //     ? ILike(`%${filterArguments.dateOfNextCheck}%`)
    //     : undefined;

    const additionalDetailsProperty =
      filterArguments?.additionalDetails !== undefined
        ? ILike(`%${filterArguments.additionalDetails}%`)
        : undefined;

    const notesProperty =
      filterArguments?.notes !== undefined
        ? ILike(`%${filterArguments.notes}%`)
        : undefined;

    return {
      name: nameProperty,
      licensePlate: licensePlateProperty,
      vin: vinProperty,
      // dateOfNextCheck: dateOfNextCheckProperty,
      additionalDetails: additionalDetailsProperty,
      notes: notesProperty,
      organizationId,
    };
  }

  async findAll(presentationArguments?: VehiclePresentationArguments) {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [vehicles, count] = await this.vehiclesRepository.findAndCount({
      ...limitArguments,
      order: this.buildOrderOption(presentationArguments?.sort),
      where: this.buildWhereOption(
        presentationArguments?.filter,
        organizationId,
      ),
    });

    return { vehicles, count };
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
