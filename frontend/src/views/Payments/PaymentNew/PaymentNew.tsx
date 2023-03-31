import { Breadcrumbs, Icon, Typography, Link as MUILink } from '@mui/material';
import { PaymentCreateRequestDto, PaymentCreateResponseDto } from '@osk/shared';
import { formatISO } from 'date-fns';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { PaymentFormNewData } from '../PaymentForm/PaymentFormNew.schema';
import { PaymentNewLayout } from '../PaymentLayout/PaymentNewLayout';

export const PaymentNew = () => {
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onCreate = async (createdPayment: PaymentFormNewData) => {
    const body: PaymentCreateRequestDto = {
      amount: createdPayment.amount,
      date: formatISO(createdPayment.date),
      note: createdPayment.note,
      idTrainee: createdPayment.traineeId,
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
    navigate(`/platnosci/${createdId}`);
    showSuccessSnackbar(`Płatność nr ${createdId} została stworzona`);
  };

  const breadcrumbs = (
    <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
      <MUILink underline="hover" to="/platnosci" component={Link} variant="h6">
        Płatności
      </MUILink>
      <Typography variant="h6" color={theme.palette.text.primary}>
        Nowa
      </Typography>
    </Breadcrumbs>
  );

  return (
    <PaymentNewLayout
      returnUrl="/platnosci"
      breadcrumbs={breadcrumbs}
      isLoading={isLoading}
      onCreate={onCreate}
      showTraineePicker
    />
  );
};
