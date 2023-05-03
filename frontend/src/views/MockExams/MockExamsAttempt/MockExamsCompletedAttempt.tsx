import useSWR from 'swr';
import { MockExamAttemptFindOneResponseDto } from '@osk/shared';
import { Button } from '@mui/material';
import { Flex } from 'reflexbox';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { MockExamQuestionLayout } from './MockExamQuestionLayout';

export const MockExamsCompletedAttempt = () => {
  const { examId } = useParams();
  const { data: attemptData, error: attemptError } =
    useSWR<MockExamAttemptFindOneResponseDto>(`/api/exams/${examId}`);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (attemptData === undefined) {
    return <FullPageLoading />;
  }

  if (attemptError) {
    return <GeneralAPIError />;
  }
  const { questions, examAttempt: attemptDetails } = attemptData;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === attemptDetails?.questions.length;
  const currentAttemptDetails = attemptDetails.questions[currentIndex];
  if (currentAttemptDetails === undefined) {
    return <GeneralAPIError />;
  }
  const currentQuestionId = currentAttemptDetails.questionId;
  if (currentQuestionId === undefined) {
    return <GeneralAPIError />;
  }
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  if (currentQuestion === undefined) {
    return <GeneralAPIError />;
  }

  const hasVideo =
    currentQuestion.mediaReference !== null &&
    currentQuestion.mediaReference !== undefined &&
    currentQuestion.mediaReference.endsWith('.wmv');
  const { answerId } = currentAttemptDetails;
  const nextQuestion = () => {
    setCurrentIndex((index) => index + 1);
  };

  const prevQuestion = () => {
    setCurrentIndex((index) => index - 1);
  };

  return (
    <Flex flexDirection="column">
      <MockExamQuestionLayout
        questionDetails={currentQuestion}
        selectedAnswer={answerId}
        onVideoEnd={() => {}}
        hasVideo={hasVideo}
        showMedia
        readOnlyMode
      />
      <Flex>
        <Button
          variant="contained"
          style={{ margin: '8px auto 0 auto', width: '50px' }}
          onClick={prevQuestion}
          disabled={isFirstQuestion}
        >
          Poprzednie pytanie
        </Button>
        <Button
          variant="contained"
          style={{ margin: '8px auto 0 auto', width: '50px' }}
          onClick={nextQuestion}
          disabled={isLastQuestion}
        >
          Następne pytanie
        </Button>
      </Flex>
    </Flex>
  );
};
