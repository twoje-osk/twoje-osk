import * as Yup from 'yup';

export interface VehiclesFormData {
  name: string;
  licensePlate: string;
  vin: string;
  dateOfNextCheck: Date;
  additionalDetails?: string;
  notes?: string;
  photo: string | null;
}

export const vehicleFormSchema = Yup.object().shape({
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
