import { MockExamQuestionsGenerateResponseDto } from '@osk/shared';
import { CreateMockExamQuestionAttemptRequestDto } from '@osk/shared/dist/dto/mockExamQuestionAttempt/mockExamQuestionAttempt.dto';
import { useState } from 'react';
import useSWR from 'swr';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { MockExamsQuestion } from './MockExamsQuestion';

export const MockExamsAttempt = () => {
  const categoryId = 6;
  const { data: questionsData, error: questionsError } =
    useSWR<MockExamQuestionsGenerateResponseDto>(
      `/api/questions/exam/${categoryId}`,
    );
  const [answeredQuestions, setAnsweredQuestions] = useState<
    CreateMockExamQuestionAttemptRequestDto[]
  >([]);

  if (questionsError) {
    return <GeneralAPIError />;
  }

  if (questionsData === undefined) {
    return <FullPageLoading />;
  }
  const generatedQuestions = questionsData.questions;

  const handleQuestionSubmit = (questionId: number, answerId: number) => {
    const newAnsweredQuestions = [
      ...answeredQuestions,
      { questionId, answerId },
    ];
    setAnsweredQuestions(newAnsweredQuestions);
    if (newAnsweredQuestions.length === generatedQuestions.length - 1) {
      console.log(answeredQuestions);
      submitExam(answeredQuestions);
    }
  };

  const submitExam = (
    submitQuestionsData: CreateMockExamQuestionAttemptRequestDto[],
  ) => {};

  return (
    <MockExamsQuestion
      question={generatedQuestions[answeredQuestions.length]}
      onQuestionSubmit={handleQuestionSubmit}
      isLastQuestion={
        answeredQuestions.length === generatedQuestions.length - 1
      }
    />
    // <div>
    //   <div>
    //     {/* <p>{JSON.stringify(generatedQuestions)}</p> */}
    //     <p>{generatedQuestions[currentQuestion]?.question}</p>
    //     {/* <p>{generatedQuestions[currentQuestion]?.answers[0]}</p> */}
    //     {/* <p>{JSON.stringify(generatedQuestions[currentQuestion])}</p> */}
    //     {generatedQuestions[currentQuestion]?.answers.map((answer) => {
    //       return <p>{answer.answerContent}</p>;
    //     })}
    //   </div>
    // </div>
  );
};
