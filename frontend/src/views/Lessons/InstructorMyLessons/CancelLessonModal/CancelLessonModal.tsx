import { TraineeFindOneResponseDto } from '@osk/shared';
import useSWR from 'swr';
import MUILink from '@mui/material/Link';
import { ActionModal } from '../../../../components/ActionModal/ActionModal';
import { FullPageLoading } from '../../../../components/FullPageLoading/FullPageLoading';
import { useCancelLesson } from './CancelLessonModal.hooks';
import { LessonEvent } from '../../TraineeMyLessons/LessonsCalendar/LessonsCalendar.types';

interface CancelLessonModalProps {
  isOpen: boolean;
  traineeId: number | null | undefined;
  lesson: LessonEvent | undefined;
  onLessonCancelFinished: () => void;
  onClose: () => void;
}
export const CancelLessonModal = ({
  traineeId,
  isOpen,
  lesson,
  onClose,
  onLessonCancelFinished,
}: CancelLessonModalProps) => {
  const { data } = useSWR<TraineeFindOneResponseDto>(
    traineeId !== undefined && traineeId !== null
      ? `/api/trainees/${traineeId}`
      : null,
  );
  const trainee = data?.trainee;
  const { lessonCancelState, onLessonCancel } = useCancelLesson(
    lesson,
    onLessonCancelFinished,
  );

  return (
    <ActionModal
      id="cancelModal"
      actionButtonColor="error"
      actionButtonIcon="delete"
      isOpen={isOpen}
      isLoading={lessonCancelState === 'loading'}
      onClose={onClose}
      onAction={onLessonCancel}
      actionButtonText="Anuluj Lekcję"
      cancelButtonText="Wróć"
      actionButtonDisabled={trainee === undefined}
      cancelButtonDisabled={trainee === undefined}
      title="Czy na pewno anulować tę lekcję?"
      width={550}
      subtitle={
        trainee === undefined ? (
          <FullPageLoading />
        ) : (
          <div>
            <div>Przed anulowaniem lekcji skontaktuj się z kursantem.</div>
            <p>
              <strong>Imię i Nazwisko</strong>:{' '}
              <MUILink href={`/kursanci/${trainee?.id}`} target="_blank">
                {trainee?.user.firstName} {trainee?.user.lastName}
              </MUILink>
              <br />
              <strong>Email</strong>: {trainee?.user.email}
              <br />
              <strong>Nr Telefonu</strong>: {trainee?.user.phoneNumber}
            </p>
          </div>
        )
      }
    />
  );
};
