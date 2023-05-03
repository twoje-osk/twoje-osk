import { Breadcrumbs, Icon, Link as MUILink, Typography } from '@mui/material';
import { TraineeFindOneResponseDto } from '@osk/shared';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { theme } from '../../../../theme';
import { PaymentEditLayout } from '../../../Payments/PaymentLayout/PaymentEditLayout';

export const TraineePaymentEdit = () => {
  const { paymentId, traineeId } = useParams();
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
          Płatność nr {paymentId}
        </Typography>
      </Breadcrumbs>
    );
  }, [paymentId, traineeData]);

  return (
    <PaymentEditLayout
      returnUrl={`/kursanci/${traineeId}/platnosci/${paymentId}`}
      breadcrumbs={breadcrumbs}
      forceLoading={traineeData === undefined}
      forceError={traineeError !== undefined}
    />
  );
};
