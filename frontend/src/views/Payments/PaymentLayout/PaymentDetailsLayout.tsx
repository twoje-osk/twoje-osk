import { Button, Icon, Stack, Toolbar } from '@mui/material';
import {
  PaymentDeleteResponseDto,
  PaymentFindOneResponseDto,
} from '@osk/shared';
import { parseISO } from 'date-fns';
import { ReactNode, useCallback } from 'react';
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { ActionModal } from '../../../components/ActionModal/ActionModal';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useActionModal } from '../../../hooks/useActionModal/useActionModal';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { PaymentForm } from '../PaymentForm/PaymentForm';
import { PaymentFormData } from '../PaymentForm/PaymentForm.schema';
import { TraineeLabel } from './TraineeLabel/TraineeLabel';

interface PaymentDetailsLayoutProps {
  returnUrl: string;
  breadcrumbs: ReactNode;
  showTrainee?: boolean;
  forceLoading?: boolean;
  forceError?: boolean;
}
export const PaymentDetailsLayout = ({
  breadcrumbs,
  returnUrl,
  showTrainee = false,
  forceLoading = false,
  forceError = false,
}: PaymentDetailsLayoutProps) => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { data, error } = useSWR<PaymentFindOneResponseDto>(
    paymentId ? `/api/payments/${paymentId}` : null,
  );

  const {
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    setLoading: setDeleteModalLoading,
  } = useActionModal();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onDelete = useCallback(async () => {
    setDeleteModalLoading(true);

    const response = await makeRequest<PaymentDeleteResponseDto>(
      `/api/payments/${paymentId}`,
      'DELETE',
    );

    if (!response.ok) {
      setDeleteModalLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(returnUrl);
    showSuccessSnackbar(`Płatność nr ${data?.payment.id} została usunięta`);
  }, [
    data?.payment.id,
    makeRequest,
    navigate,
    paymentId,
    returnUrl,
    setDeleteModalLoading,
    showErrorSnackbar,
    showSuccessSnackbar,
  ]);

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
        <PaymentForm initialValues={initialValues} disabled>
          {showTrainee && <TraineeLabel trainee={payment.trainee} />}
          <Stack
            direction="row"
            spacing={1}
            marginTop={showTrainee ? '16px' : undefined}
          >
            <Button
              variant="contained"
              startIcon={<Icon>edit</Icon>}
              component={Link}
              to="edytuj"
            >
              Edytuj
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<Icon>delete</Icon>}
              onClick={openDeleteModal}
            >
              Usuń
            </Button>
          </Stack>
        </PaymentForm>
      </Box>
      <ActionModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        onAction={onDelete}
        id="delete-payment-modal"
        title="Czy na pewno chcesz usunąć tę płatność?"
      />
    </div>
  );
};
