import { Breadcrumbs, Icon, Typography, Link as MUILink } from '@mui/material';
import {
  PaymentCreateRequestDto,
  PaymentCreateResponseDto,
  TraineeFindOneResponseDto,
} from '@osk/shared';
import { formatISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { FullPageLoading } from '../../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../../theme';
import { PaymentFormData } from '../../../Payments/PaymentForm/PaymentForm.schema';
import { PaymentNewLayout } from '../../../Payments/PaymentLayout/PaymentNewLayout';

export const TraineePaymentNew = () => {
  const { traineeId } = useParams();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onCreate = async (createdPayment: PaymentFormData) => {
    if (traineeId === undefined) {
      return;
    }

    const body: PaymentCreateRequestDto = {
      amount: createdPayment.amount,
      date: formatISO(createdPayment.date),
      note: createdPayment.note,
      idTrainee: +traineeId,
    };

    setIsLoading(true);
    const response = await makeRequest<
      PaymentCreateResponseDto,
      PaymentCreateRequestDto
    >(`/api/payments`, 'POST', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    const createdId = response.data.payment.id;
    navigate(`/kursanci/${traineeId}/platnosci/${createdId}`);
    showSuccessSnackbar(`Płatność nr ${createdId} została stworzona`);
  };

  const { data: traineeData, error: traineeError } =
    useSWR<TraineeFindOneResponseDto>(
      traineeId ? `/api/trainees/${traineeId}` : null,
    );

  const breadcrumbs = useMemo(() => {
    if (traineeData === undefined) {
      return null;
    }

    const { trainee } = traineeData;
    return (
      <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
        <MUILink underline="hover" to="/kursanci" component={Link} variant="h6">
          Kursanci
        </MUILink>
        <MUILink
          underline="hover"
          to={`/kursanci/${trainee.id}`}
          component={Link}
          variant="h6"
        >
          {trainee.user.firstName} {trainee.user.lastName}
        </MUILink>
        <MUILink
          underline="hover"
          to={`/kursanci/${trainee.id}/platnosci`}
          component={Link}
          variant="h6"
        >
          Płatności
        </MUILink>
        <Typography variant="h6" color={theme.palette.text.primary}>
          Nowa
        </Typography>
      </Breadcrumbs>
    );
  }, [traineeData]);

  if (traineeError) {
    return <GeneralAPIError />;
  }

  if (traineeData === undefined) {
    return <FullPageLoading />;
  }

  return (
    <PaymentNewLayout
      returnUrl={`/kursanci/${traineeId}/platnosci`}
      breadcrumbs={breadcrumbs}
      isLoading={isLoading}
      onCreate={onCreate}
    />
  );
};
