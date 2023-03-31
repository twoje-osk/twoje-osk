import { LoadingButton } from '@mui/lab';
import { Button, Icon, Stack, Toolbar } from '@mui/material';
import {
  PaymentFindOneResponseDto,
  PaymentUpdateRequestDto,
  PaymentUpdateResponseDto,
} from '@osk/shared';
import { formatISO, parseISO } from 'date-fns';
import { ReactNode, useState } from 'react';
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { PaymentForm } from '../PaymentForm/PaymentForm';
import { PaymentFormData } from '../PaymentForm/PaymentForm.schema';
import { TraineeLabel } from './TraineeLabel/TraineeLabel';

interface PaymentEditLayoutProps {
  returnUrl: string;
  breadcrumbs: ReactNode;
  showTrainee?: boolean;
  forceLoading?: boolean;
  forceError?: boolean;
}
export const PaymentEditLayout = ({
  breadcrumbs,
  returnUrl,
  showTrainee = false,
  forceLoading = false,
  forceError = false,
}: PaymentEditLayoutProps) => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { data, error, mutate } = useSWR<PaymentFindOneResponseDto>(
    paymentId ? `/api/payments/${paymentId}` : null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onEdit = async (editedPayment: PaymentFormData) => {
    const body: PaymentUpdateRequestDto = {
      amount: editedPayment.amount,
      date: formatISO(editedPayment.date),
      note: editedPayment.note,
    };

    setIsLoading(true);
    const vehicleApiUrl = `/api/payments/${paymentId}`;
    const response = await makeRequest<
      PaymentUpdateResponseDto,
      PaymentUpdateRequestDto
    >(vehicleApiUrl, 'PATCH', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    mutate();
    navigate(returnUrl);
    showSuccessSnackbar(
      `Płatność nr ${data?.payment.id} została zmodyfikowana`,
    );
  };

  if (paymentId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error || forceError) {
    return <GeneralAPIError />;
  }

  if (data === undefined || forceLoading) {
    return <FullPageLoading />;
  }

  const { payment } = data;

  const initialValues: PaymentFormData = {
    amount: payment.amount,
    date: parseISO(payment.date),
    note: payment.note,
  };

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        {breadcrumbs}
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <PaymentForm initialValues={initialValues} onSubmit={onEdit}>
          {showTrainee && <TraineeLabel trainee={payment.trainee} />}
          <Stack
            direction="row"
            spacing={1}
            marginTop={showTrainee ? '16px' : undefined}
          >
            <LoadingButton
              variant="contained"
              startIcon={<Icon>save</Icon>}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Zapisz
            </LoadingButton>
            <Button
              variant="outlined"
              component={Link}
              to={returnUrl}
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </PaymentForm>
      </Box>
    </div>
  );
};
