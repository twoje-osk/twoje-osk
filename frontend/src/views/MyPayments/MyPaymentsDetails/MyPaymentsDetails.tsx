import { Breadcrumbs, Icon, Link as MUILink, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { theme } from '../../../theme';
import { PaymentDetailsLayout } from '../../Payments/PaymentLayout/PaymentDetailsLayout';

export const MyPaymentDetails = () => {
  const { paymentId } = useParams();
  const breadcrumbs = (
    <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
      <MUILink
        underline="hover"
        to="/moje-platnosci"
        component={Link}
        variant="h6"
      >
        Moje Płatności
      </MUILink>
      <Typography variant="h6" color={theme.palette.text.primary}>
        Płatność nr {paymentId}
      </Typography>
    </Breadcrumbs>
  );

  return (
    <PaymentDetailsLayout
      returnUrl="/moje-platnosci"
      breadcrumbs={breadcrumbs}
      showTrainee
    />
  );
};
