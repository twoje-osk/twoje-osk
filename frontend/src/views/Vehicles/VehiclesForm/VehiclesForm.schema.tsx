import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface VehiclesFormData {
  name: string;
  licensePlate: string;
  vin: string;
  dateOfNextCheck: Date | null;
  additionalDetails?: string;
  notes?: string;
  photo?: string;
}

export interface VehiclesSubmitData extends VehiclesFormData {
  dateOfNextCheck: Date;
}

setupYupLocale();
export const vehicleFormSchema: Yup.SchemaOf<VehiclesSubmitData> =
  Yup.object().shape({
    photo: Yup.string(),
    name: Yup.string().required().max(64),
    licensePlate: Yup.string().required().max(7),
    vin: Yup.string().required().length(17),
    dateOfNextCheck: Yup.date().required(),
    additionalDetails: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value))
      .max(1000),
    notes: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value))
      .max(1000),
  });
