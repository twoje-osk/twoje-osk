import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { VehicleSortField } from './vehicles.utils';

export interface VehicleArguments {
  name?: string;
  licensePlate?: string;
  vin?: string;
  dateOfNextCheck?: Date;
  photo: string | null;
  additionalDetails: string | null;
  notes: string | null;
}
export interface VehicleArgumentsUpdate extends VehicleArguments {}

export type VehiclePresentationSortArguments =
  PresentationSortArguments<VehicleSortField>;

export interface VehiclePresentationFilterArguments {
  name?: string;
  licensePlate?: string;
  vin?: string;
  dateOfNextCheckFrom?: Date;
  dateOfNextCheckTo?: Date;
  photo?: string;
  additionalDetails?: string;
  notes?: string;
}

export interface VehiclePresentationArguments {
  sort: VehiclePresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: VehiclePresentationFilterArguments;
}
