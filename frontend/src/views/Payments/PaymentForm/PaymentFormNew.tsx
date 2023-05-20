import { TraineeFilterByNameResponseDto } from '@osk/shared';
import { Formik, FormikHelpers } from 'formik';
import { ReactNode, useState } from 'react';
import {
  PaymentFormNewData,
  PaymentForNewInitialData,
  paymentFormNewSchema,
} from './PaymentFormNew.schema';
import { PaymentFormFields } from './PaymentFormFields';
import {
  FAutocomplete,
  FAutocompleteOption,
} from '../../../components/FAutocomplete/FAutocomplete';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

interface PaymentFormNewProps {
  initialValues?: PaymentForNewInitialData;
  disabled?: boolean;
  onSubmit?: (
    values: PaymentFormNewData,
    formikHelpers: FormikHelpers<PaymentFormNewData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: PaymentForNewInitialData = {
  amount: undefined,
  traineeId: undefined,
  date: new Date(),
  note: '',
};

export const PaymentFormNew = ({
  initialValues,
  disabled = false,
  onSubmit = () => undefined,
  children: actions,
}: PaymentFormNewProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const makeRequest = useMakeRequestWithAuth();
  const [traineesOptions, setTraineesOptions] = useState<FAutocompleteOption[]>(
    [],
  );
  const traineesUrl = `/api/trainees/name?like=`;
  const handleTraineeChange = async (newValue: string | undefined) => {
    if (newValue === undefined) {
      setTraineesOptions([]);
      return;
    }
    setIsLoading(true);
    const response = await makeRequest<
      TraineeFilterByNameResponseDto,
      undefined
    >(`${traineesUrl}${newValue}`, 'GET');
    if (response.ok) {
      const options = response.data.trainees.map((option) => {
        return {
          label: `${option.user.firstName} ${option.user.lastName}`,
          id: option.id,
        };
      });
      setTraineesOptions(options);
    }
    setIsLoading(false);
  };

  return (
    <Formik<PaymentForNewInitialData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={paymentFormNewSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <PaymentFormFields actions={actions} disabled={disabled}>
        <FAutocomplete
          onInputChange={handleTraineeChange}
          options={traineesOptions}
          loading={isLoading}
          label="Kursant"
          name="traineeId"
          id="traineeId"
          required
        />
      </PaymentFormFields>
    </Formik>
  );
};
