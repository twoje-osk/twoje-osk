import { LoadingButton } from '@mui/lab';
import { Button, Icon, Stack, Toolbar } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import { PaymentForm } from '../PaymentForm/PaymentForm';
import { PaymentFormData } from '../PaymentForm/PaymentForm.schema';
import { PaymentFormNew } from '../PaymentForm/PaymentFormNew';
import { PaymentFormNewData } from '../PaymentForm/PaymentFormNew.schema';

type PaymentNewLayoutProps = {
  returnUrl: string;
  breadcrumbs: ReactNode;
  showTrainee?: boolean;
  isLoading: boolean;
} & (
  | {
      onCreate: (createdPayment: PaymentFormNewData) => void;
      showTraineePicker: true;
    }
  | {
      onCreate: (createdPayment: PaymentFormData) => void;
      showTraineePicker?: false;
    }
);

export const PaymentNewLayout = ({
  breadcrumbs,
  returnUrl,
  showTrainee = false,
  isLoading,
  ...props
}: PaymentNewLayoutProps) => {
  const PaymentFormComponent = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (props.showTraineePicker) {
        return (
          <PaymentFormNew onSubmit={props.onCreate}>{children}</PaymentFormNew>
        );
      }

      return <PaymentForm onSubmit={props.onCreate}>{children}</PaymentForm>;
    },
    [props.onCreate, props.showTraineePicker],
  );

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
        <PaymentFormComponent>
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
        </PaymentFormComponent>
      </Box>
    </div>
  );
};
