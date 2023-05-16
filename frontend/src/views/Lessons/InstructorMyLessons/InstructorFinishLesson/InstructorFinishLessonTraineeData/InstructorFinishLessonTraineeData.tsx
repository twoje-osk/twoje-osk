import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Icon,
} from '@mui/material';
import styled from '@emotion/styled';
import { TraineeDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { Box } from 'reflexbox';
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

const Accordion = styled(MuiAccordion)`
  &.MuiAccordion-root {
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: none;

    &:not(:last-child) {
      border-bottom: 0;
    }

    &:before {
      display: none;
    }

    &.Mui-expanded {
      margin: auto;
    }
  }
`;

const AccordionSummary = styled(MuiAccordionSummary)`
  &.MuiAccordionSummary-root {
    background-color: rgba(0, 0, 0, 0.03);
    min-height: 56px;

    &.Mui-expanded {
      min-height: 56px;
    }
  }

  .MuiAccordionSummary-content {
    &.Mui-expanded {
      margin: 12px 0;
    }
  }
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  &.MuiAccordionDetails-root {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    padding: 16px;
  }
`;
