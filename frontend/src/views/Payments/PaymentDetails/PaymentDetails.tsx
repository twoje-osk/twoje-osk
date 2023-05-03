import { Breadcrumbs, Icon, Link as MUILink, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { theme } from '../../../theme';
import { PaymentDetailsLayout } from '../PaymentLayout/PaymentDetailsLayout';

export const PaymentDetails = () => {
  const { paymentId } = useParams();
  const breadcrumbs = (
    <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
      <MUILink underline="hover" to="/platnosci" component={Link} variant="h6">
        Płatności
      </MUILink>
      <Typography variant="h6" color={theme.palette.text.primary}>
        Płatność nr {paymentId}
      </Typography>
    </Breadcrumbs>
  );

  return (
    <PaymentDetailsLayout
      returnUrl="/platnosci"
      breadcrumbs={breadcrumbs}
      showTrainee
    />
  );
};
