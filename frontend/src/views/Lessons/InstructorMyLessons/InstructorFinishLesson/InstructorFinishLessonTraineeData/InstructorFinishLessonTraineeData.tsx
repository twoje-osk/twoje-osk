import { Icon } from '@mui/material';
import { TraineeDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { Box } from 'reflexbox';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '../../../../../components/Accordion/Accordion';
import { TraineeForm } from '../../../../Trainees/TraineeForm/TraineeForm';
import { TraineeFormData } from '../../../../Trainees/TraineeForm/TraineeForm.schema';

interface InstructorFinishLessonTraineeDataProps {
  trainee: TraineeDto;
}
export const InstructorFinishLessonTraineeData = ({
  trainee,
}: InstructorFinishLessonTraineeDataProps) => {
  const initialValues: TraineeFormData = {
    firstName: trainee.user.firstName,
    lastName: trainee.user.lastName,
    email: trainee.user.email,
    phoneNumber: trainee.user.phoneNumber,
    pesel: trainee.pesel ?? 'Brak',
    dateOfBirth: parseISO(trainee.dateOfBirth),
    pkk: trainee.pkk,
    driversLicenseNumber: trainee.driversLicenseNumber ?? 'Brak',
    createdAt: parseISO(trainee.user.createdAt),
    driversLicenseCategory: trainee.driversLicenseCategoryId ?? undefined,
  };

  return (
    <Box p="16px" pt="0">
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon>expand_more</Icon>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Dane Kursanta
        </AccordionSummary>
        <AccordionDetails>
          <TraineeForm initialValues={initialValues} disabled />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
