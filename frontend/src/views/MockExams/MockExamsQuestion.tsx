import styled from '@emotion/styled';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material';
import { MockExamQuestionDto } from '@osk/shared';
import { useEffect, useState } from 'react';
import { Flex } from 'reflexbox';
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

  useEffect(() => {
    setSelectedAnswer(undefined);
  }, [question]);

  const nextQuestionLabel = isLastQuestion
    ? 'Zakończ egzamin'
    : 'Następne pytanie';

  const handleAnswerSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedAnswer(+event.target.value);
    }
  };

  const submitQuestion = () => {
    onQuestionSubmit(question.id, selectedAnswer);
  };

  return (
    <Flex
      flexDirection="column"
      style={{ height: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}
    >
      <Flex flexDirection="column" flex="1">
        <Media mediaURL={question.mediaURL} />
        <Typography
          variant="h6"
          align="center"
          color={theme.palette.text.primary}
          sx={{
            width: '85%',
            margin: 'auto',
            paddingTop: '2rem',
            paddingBottom: '1rem',
          }}
        >
          {question.question}
        </Typography>
      </Flex>
      <Flex alignItems="center" flexDirection="column">
        <Flex
          style={{ margin: 'auto', padding: 'auro' }}
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
        <Button variant="contained" onClick={submitQuestion}>
          {nextQuestionLabel}
        </Button>
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

  background: ${theme.palette.grey[300]};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
