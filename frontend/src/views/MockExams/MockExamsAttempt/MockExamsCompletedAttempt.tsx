import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { MockExamAttemptFindOneResponseDto } from '@osk/shared';
import { Typography } from '@mui/material';
import { Flex } from 'reflexbox';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';

export const MockExamsCompletedAttempt = () => {
  const { examId } = useParams();
  const { data: attemptData, error: attemptError } =
    useSWR<MockExamAttemptFindOneResponseDto>(`/api/exams/${examId}`);
  const navigate = useNavigate();

  if (attemptData === undefined) {
    return <FullPageLoading />;
  }

  if (attemptError) {
    return <GeneralAPIError />;
  }
  const { questions } = attemptData;

  return (
    <Flex>
      <Typography />
    </Flex>
  );
};
