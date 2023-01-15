import { LoadingButton } from '@mui/lab';
import { Modal, Typography, Button, Icon, Stack, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onAction: () => void;
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actionButtonText?: ReactNode;
  actionButtonColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  actionButtonIcon?: string;
  cancelButtonText?: ReactNode;
  actionButtonDisabled?: boolean;
  cancelButtonDisabled?: boolean;
  width?: number;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 4,
};

export const ActionModal = ({
  id,
  isOpen,
  isLoading = false,
  onClose,
  onCancel = onClose,
  onAction: onDelete,
  title,
  subtitle = 'Ta akcja jest nieodwracalna.',
  actionButtonText = 'Usuń',
  actionButtonColor = 'error',
  actionButtonIcon = 'delete',
  cancelButtonText = 'Anuluj',
  actionButtonDisabled = false,
  cancelButtonDisabled = false,
  width = 600,
}: DeleteModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <Paper sx={{ ...style, width }} elevation={24}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ my: 2 }}>
          {subtitle}
        </Typography>
        <Stack direction="row" spacing={1}>
          <LoadingButton
            color={actionButtonColor}
            variant="contained"
            startIcon={<Icon>{actionButtonIcon}</Icon>}
            onClick={onDelete}
            fullWidth
            loading={isLoading}
            disabled={isLoading || actionButtonDisabled}
          >
            {actionButtonText}
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
            disabled={isLoading || cancelButtonDisabled}
          >
            {cancelButtonText}
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};
