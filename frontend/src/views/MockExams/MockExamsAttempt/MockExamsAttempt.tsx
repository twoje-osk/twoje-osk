import {
  MockExamAttemptSubmitRequestDto,
  MockExamAttemptSubmitResponseDto,
  MockExamQuestionsGenerateResponseDto,
} from '@osk/shared';
import useSWR from 'swr';
import { CreateMockExamQuestionAttemptRequestDto } from '@osk/shared/dist/dto/mockExamQuestionAttempt/mockExamQuestionAttempt.dto';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { MockExamsQuestion } from './MockExamsQuestion';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';

export const MockExamsAttempt = () => {
  const categoryId = 6;
  const { data: questionsData, error: questionsError } =
    useSWR<MockExamQuestionsGenerateResponseDto>(
      `/api/questions/exam/${categoryId}`,
    );
  const [answeredQuestions, setAnsweredQuestions] = useState<
    CreateMockExamQuestionAttemptRequestDto[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  if (questionsData === undefined || isSubmitting) {
    return <FullPageLoading />;
  }

  const generatedQuestions = questionsData.questions;
  const currentQuestion = generatedQuestions[answeredQuestions.length];
  const isLastQuestion =
    answeredQuestions.length === generatedQuestions.length - 1;

  if (questionsError || currentQuestion === undefined) {
    return <GeneralAPIError />;
  }

  const handleQuestionSubmit = async (
    questionId: number,
    answerId: number | undefined,
  ) => {
    const newAnsweredQuestions = [
      ...answeredQuestions,
      { questionId, answerId },
    ];
    setAnsweredQuestions(newAnsweredQuestions);
    if (newAnsweredQuestions.length === generatedQuestions.length) {
      await submitExam(newAnsweredQuestions);
    }
  };

  const submitExam = async (
    submitQuestionsData: CreateMockExamQuestionAttemptRequestDto[],
  ) => {
    const body: MockExamAttemptSubmitRequestDto = {
      mockExam: {
        questions: submitQuestionsData,
      },
    };

    setIsSubmitting(true);
    const examURL = `/api/exams`;
    const response = await makeRequest<
      MockExamAttemptSubmitResponseDto,
      MockExamAttemptSubmitRequestDto
    >(examURL, 'POST', body);

    if (!response.ok) {
      setIsSubmitting(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/e-learning/${response.data.id}/rezultat`);
    showSuccessSnackbar(`Egzamin zakończony!`);
  };
  return (
    <MockExamsQuestion
      question={currentQuestion}
      onQuestionSubmit={handleQuestionSubmit}
      isLastQuestion={isLastQuestion}
    />
  );
};
