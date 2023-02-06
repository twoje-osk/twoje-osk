import { MockExamQuestionsGenerateResponseDto } from '@osk/shared';
import { useState } from 'react';
import useSWR from 'swr';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';

export const MockExamsAttempt = () => {
  const categoryId = 6;
  const { data: questionsData, error: questionsError } =
    useSWR<MockExamQuestionsGenerateResponseDto>(
      `/api/questions/exam/${categoryId}`,
    );
  const [currentQuestion] = useState<number>(0);

  if (questionsError) {
    return <GeneralAPIError />;
  }

  if (questionsData === undefined) {
    return <FullPageLoading />;
  }
  const generatedQuestions = questionsData.questions;

  return (
    <div>
      <div>
        {/* <p>{JSON.stringify(generatedQuestions)}</p> */}
        <p>{generatedQuestions[currentQuestion]?.question}</p>
        <p>{generatedQuestions[currentQuestion]?.question}</p>
        {/* <p>{generatedQuestions[currentQuestion]?.answers[0]}</p> */}
        <p>{JSON.stringify(generatedQuestions[currentQuestion])}</p>
      </div>
    </div>
  );
};
