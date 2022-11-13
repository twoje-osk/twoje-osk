import { LoadingButton } from '@mui/lab';
import { Button, Icon, Modal, Paper, Stack, Typography } from '@mui/material';
import { DtoAnnouncement } from '@osk/shared';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { FTextField } from '../../../components/FTextField/FTextField';
import {
  AnnouncementFormSchema,
  announcementsValidationSchema,
} from './AnnouncementFormModal.schema';

interface AnnouncementFormModalProps {
  title: string;
  announcement?: DtoAnnouncement;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (values: AnnouncementFormSchema) => Promise<void>;
}

export const AnnouncementFormModal = ({
  title,
  announcement,
  onSave,
  onCancel,
  isOpen,
}: AnnouncementFormModalProps) => {
  const defaultValues = { subject: '', body: '' };
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (values: AnnouncementFormSchema) => {
    setIsLoading(true);
    await onSave(values);
    setIsLoading(false);
  };
  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Paper
        elevation={24}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: '2rem' }}
        >
          {title}
        </Typography>
        <Formik<AnnouncementFormSchema>
          onSubmit={handleSubmit}
          initialValues={announcement ?? defaultValues}
          validationSchema={announcementsValidationSchema}
        >
          <Form noValidate>
            <Stack spacing={2} style={{ flex: 1 }} justifyContent="flex-start">
              <FTextField required id="subject" name="subject" label="Tytuł" />
              <FTextField
                required
                id="body"
                name="body"
                label="Treść"
                multiline
                rows={5}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: '2rem' }}>
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
                onClick={onCancel}
                disabled={isLoading}
              >
                Anuluj
              </Button>
            </Stack>
          </Form>
        </Formik>
      </Paper>
    </Modal>
  );
};
