import { Button, LinearProgress, Typography } from '@mui/material';
import { MockExamQuestionDto } from '@osk/shared';
import { Flex } from 'reflexbox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { theme } from '../../../theme';
import { useQuestionState } from '../../../hooks/useQuestionState/useQuestionState';
import { MockExamQuestionLayout } from './MockExamQuestionLayout';
import {
  AMOUNT_OF_ADVANCED_QUESTIONS,
  AMOUNT_OF_ELEMENTARY_QUESTIONS,
} from '../MockExams.constants';
import { LAYOUT_HEIGHT } from '../../Layout/Layout';

interface MockExamQuestionInterface {
  question: MockExamQuestionDto;
  onQuestionSubmit: (questionId: number, answerId: number | undefined) => void;
  isLastQuestion: boolean;
}

export const MockExamsQuestion = ({
  question,
  onQuestionSubmit,
  isLastQuestion,
}: MockExamQuestionInterface) => {
  const selectedAnswerRef = useRef<number | undefined>(undefined);
  const [selectedAnswer, setSelectedAnswerState] = useState<number>();
  const [progress, setProgress] = useState(0);
  const { state, startReadingQuestion, startAnsweringQuestion, startVideo } =
    useQuestionState();
  const [elementaryQuestionsAmount, setElementaryQuestionsAmount] = useState(0);
  const [advancedQuestionsAmount, setAdvancedQuestionsAmount] = useState(0);

  const setSelectedAnswer = (value: number | undefined) => {
    setSelectedAnswerState(value);
    selectedAnswerRef.current = value;
  };
  const maxTimeInMs = useMemo(() => {
    const maxTime =
      state.type === 'reading'
        ? question.type.timeToReadTheQuestion
        : question.type.timeToAnswer;
    return maxTime * 1000;
  }, [
    question.type.timeToAnswer,
    question.type.timeToReadTheQuestion,
    state.type,
  ]);

  const hasMedia = useMemo(
    () =>
      question.mediaReference !== null && question.mediaReference !== undefined,
    [question],
  );
  const hasVideo = useMemo(() => {
    return (
      hasMedia &&
      question.mediaReference !== null &&
      question.mediaReference !== undefined &&
      question.mediaReference.endsWith('.wmv')
    );
  }, [question.mediaReference, hasMedia]);

  const submitQuestion = useCallback(() => {
    onQuestionSubmit(question.id, selectedAnswerRef.current);
  }, [onQuestionSubmit, question.id]);

  const goToNextState = useCallback(() => {
    if (state.type === 'reading') {
      if (hasVideo) {
        startVideo();
      } else {
        startAnsweringQuestion();
      }
    } else {
      submitQuestion();
    }
  }, [
    hasVideo,
    startAnsweringQuestion,
    startVideo,
    state.type,
    submitQuestion,
  ]);

  useEffect(() => {
    setSelectedAnswer(undefined);
    if (question.type.scope === 'Podstawowy') {
      startReadingQuestion();
      setElementaryQuestionsAmount((prev) => prev + 1);
    } else {
      startAnsweringQuestion();
      setAdvancedQuestionsAmount((prev) => prev + 1);
    }
  }, [question, startAnsweringQuestion, startReadingQuestion]);

  useEffect(() => {
    let currentTimePassed = 0;
    const step = maxTimeInMs / 500;
    let timer: number;
    if (state.type === 'video') {
      setProgress(0);
    } else {
      timer = window.setInterval(() => {
        currentTimePassed += step;
        const newProgress = (currentTimePassed / maxTimeInMs) * 100;
        if (newProgress >= 100) {
          goToNextState();
        } else {
          setProgress((currentTimePassed / maxTimeInMs) * 100);
        }
      }, step);
    }

    return () => {
      window.clearInterval(timer);
    };
  }, [
    goToNextState,
    maxTimeInMs,
    state,
    question.type.timeToAnswer,
    question.type.timeToReadTheQuestion,
  ]);

  const nextQuestionLabel = isLastQuestion
    ? 'Zakończ egzamin'
    : 'Następne pytanie';
  const startLabel = 'Start';

  const handleAnswerSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedAnswer(+event.target.value);
    }
  };

  const handleReadyToAnswer = () => {
    goToNextState();
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        minHeight: LAYOUT_HEIGHT,
        paddingTop: '8px',
        paddingBottom: '8px',
      }}
    >
      <Flex>
        <Typography
          variant="h6"
          align="center"
          color={theme.palette.text.primary}
          sx={{
            width: '85%',
            margin: 'auto',
            marginTop: '24px',
            marginBottom: '24px',
          }}
        >
          Zakres podstawowy {elementaryQuestionsAmount}/
          {AMOUNT_OF_ELEMENTARY_QUESTIONS}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color={theme.palette.text.primary}
          sx={{
            width: '85%',
            margin: 'auto',
            marginTop: '24px',
            marginBottom: '24px',
          }}
        >
          Zakres specjalistyczny {advancedQuestionsAmount}/
          {AMOUNT_OF_ADVANCED_QUESTIONS}
        </Typography>
      </Flex>
      <Flex flexDirection="column" flex="1">
        <MockExamQuestionLayout
          questionDetails={question}
          showMedia={state.showMedia}
          hasVideo={hasVideo}
          onVideoEnd={startAnsweringQuestion}
          onAnswerSelection={handleAnswerSelection}
          selectedAnswer={selectedAnswer}
          readOnlyMode={false}
        />
        <LinearProgress
          variant="determinate"
          style={{
            height: '16px',
            borderRadius: '0.4rem',
            width: '80%',
            margin: '16px auto 16px auto',
          }}
          value={progress}
        />
        <Flex
          style={{ margin: '8px 0 8px 0', gap: '16px' }}
          justifyContent="center"
        >
          {state.showStartButton && (
            <Button variant="outlined" onClick={handleReadyToAnswer}>
              {startLabel}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={submitQuestion}
            disabled={selectedAnswer === undefined}
          >
            {nextQuestionLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
