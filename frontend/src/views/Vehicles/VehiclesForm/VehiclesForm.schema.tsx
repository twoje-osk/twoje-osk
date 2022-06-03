import * as Yup from 'yup';

export interface VehiclesFormData {
  name: string;
  licensePlate: string;
  vin: string;
  dateOfNextCheck: Date | null;
  additionalDetails?: string;
  notes?: string;
  photo?: string | null;
}

export interface VehiclesSubmitData extends VehiclesFormData {
  dateOfNextCheck: Date;
}

export const vehicleFormSchema: Yup.SchemaOf<VehiclesSubmitData> =
  Yup.object().shape({
    photo: Yup.string(),
    name: Yup.string().required(),
    licensePlate: Yup.string().required(),
    vin: Yup.string().required(),
    dateOfNextCheck: Yup.date().required(),
    additionalDetails: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
    notes: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
  });
