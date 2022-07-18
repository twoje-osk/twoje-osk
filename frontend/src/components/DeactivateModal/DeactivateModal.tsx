import { LoadingButton } from '@mui/lab';
import { Modal, Typography, Button, Icon, Stack, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface DeactivateModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onDeactivate: () => void;
  id: string;
  title?: ReactNode;
  subtitle?: ReactNode;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 4,
};

export const DeactivateModal = ({
  id,
  isOpen,
  isLoading = false,
  onClose,
  onCancel = onClose,
  onDeactivate,
  title = 'Jesteś pewien?',
  subtitle = 'Ta akcja jest nieodwracalna.',
}: DeactivateModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <Paper sx={style} elevation={24}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ my: 2 }}>
          {subtitle}
        </Typography>
        <Stack direction="row" spacing={1}>
          <LoadingButton
            color="error"
            variant="contained"
            startIcon={<Icon>delete</Icon>}
            onClick={onDeactivate}
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Dezaktywuj
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
            disabled={isLoading}
          >
            Anuluj
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};
