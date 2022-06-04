import { LoadingButton } from '@mui/lab';
import { Modal, Typography, Button, Icon, Stack, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onDelete: () => void;
  id: string;
  title: ReactNode;
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

export const DeleteModal = ({
  id,
  isOpen,
  isLoading = false,
  onClose,
  onCancel = onClose,
  onDelete,
  title,
  subtitle = 'Ta akcja jest nieodwracalna.',
}: DeleteModalProps) => {
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
            onClick={onDelete}
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Usuń
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
