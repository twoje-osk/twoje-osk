import styled from '@emotion/styled';
import {
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { MockExamQuestionDto } from '@osk/shared';
import { useEffect, useMemo, useState } from 'react';
import { Flex } from 'reflexbox';
import { useQuestionState } from '../../hooks/useQuestionState/useQuestionState';
import { theme } from '../../theme';

interface MockExamQuestionInterface {
  question: MockExamQuestionDto;
  onQuestionSubmit: (questionId: number, answerId: number | undefined) => void;
  isLastQuestion: boolean;
}

interface MediaInterface {
  mediaURL: string | null;
}

export const MockExamsQuestion = ({
  question,
  onQuestionSubmit,
  isLastQuestion,
}: MockExamQuestionInterface) => {
  const { answers } = question;
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [progress, setProgress] = useState(0);
  const [state, startReadingQuestion, startAnsweringQuestion, startVideo] =
    useQuestionState();
  const [elementaryQuestionsAmount, setElementaryQuestionsAmount] = useState(0);
  const [advancedQuestionsAmount, setAdvancedQuestionsAmount] = useState(0);

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

  const hasMedia = useMemo(() => question.mediaReference !== null, [question]);
  const hasVideo = useMemo(
    () => hasMedia && question.mediaReference?.endsWith('.wmv'),
    [question.mediaReference, hasMedia],
  );

  const nextState = () => {
    if (state.type === 'reading') {
      if (hasVideo) {
        startVideo();
      } else {
        startAnsweringQuestion();
      }
    } else {
      submitQuestion();
    }
  };

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
    const timer = setInterval(() => {
      currentTimePassed += step;
      const newProgress = (currentTimePassed / maxTimeInMs) * 100;
      if (newProgress >= 100) {
        nextState();
      } else {
        setProgress((currentTimePassed / maxTimeInMs) * 100);
      }
    }, step);

    return () => {
      clearInterval(timer);
    };
  }, [
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
    startAnsweringQuestion();
  };

  const submitQuestion = () => {
    onQuestionSubmit(question.id, selectedAnswer);
  };

  return (
    <Flex
      flexDirection="column"
      style={{ height: '100%', paddingTop: '8px', paddingBottom: '8px' }}
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
          Zakres podstawowy {elementaryQuestionsAmount}/20
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
          Zakres specjalistyczny {advancedQuestionsAmount}/12
        </Typography>
      </Flex>
      <Flex flexDirection="column" flex="1">
        {state.showMedia && <Media mediaURL={question.mediaURL} />}
        <Typography
          variant="h6"
          align="center"
          color={theme.palette.text.primary}
          sx={{
            width: '85%',
            margin: 'auto',
            marginTop: state.showMedia ? '8px' : 'auto',
            marginBottom: state.showMedia ? '8px' : 'auto',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          {question.question}
        </Typography>
      </Flex>
      <Flex
        alignItems="center"
        style={{ margin: '16px 0 32px 0' }}
        flexDirection="column"
      >
        <Flex
          style={{ margin: '8px auto 8px auto', padding: 'auto' }}
          flexDirection={answers.length > 2 ? 'column' : 'row'}
        >
          {answers.map((answer) => {
            return (
              <FormControlLabel
                key={answer.id}
                value={answer.id}
                control={
                  <Checkbox
                    checked={selectedAnswer === answer.id}
                    color="primary"
                    onChange={handleAnswerSelection}
                    value={answer.id.toString()}
                    inputProps={{ type: 'radio' }}
                    name="answer"
                  />
                }
                label={answer.answerContent}
                labelPlacement="end"
              />
            );
          })}
        </Flex>
        <LinearProgress
          variant="determinate"
          style={{
            height: '16px',
            borderRadius: '0.4rem',
            width: '80%',
            margin: '24px auto 24px auto',
          }}
          value={progress}
        />
        <Flex style={{ margin: '8px 0 8px 0' }}>
          {state.showStartButton && (
            <Button
              variant="outlined"
              style={{ margin: '8px 8px 0 auto' }}
              onClick={handleReadyToAnswer}
            >
              {startLabel}
            </Button>
          )}
          <Button
            variant="contained"
            style={{ margin: '8px auto 0 auto' }}
            onClick={submitQuestion}
          >
            {nextQuestionLabel}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

const Media = ({ mediaURL }: MediaInterface) => {
  return (
    <StyledImageWrapper elevation={1}>
      {mediaURL && <StyledImage width={800} src={mediaURL} alt="" />}
      {!mediaURL && 'Brak Zdjęcia'}
    </StyledImageWrapper>
  );
};

const StyledImageWrapper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: 1;
  aspect-ratio: 16/9;
  margin: auto;
  margin-top: 8px;
  margin-bottom: 48px;
  max-height: 720px;
  background: ${theme.palette.grey[300]};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
