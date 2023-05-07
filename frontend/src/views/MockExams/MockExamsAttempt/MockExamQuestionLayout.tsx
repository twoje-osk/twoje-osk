import { DtoMockExamQuestionAnswer, MockExamQuestionDto } from '@osk/shared';
import styled from '@emotion/styled';
import { Checkbox, FormControlLabel, Paper, Typography } from '@mui/material';
import { Flex } from 'reflexbox';
import { theme } from '../../../theme';

interface QuestionLayoutProps {
  questionDetails: MockExamQuestionDto;
  selectedAnswer: number | undefined;
  showMedia: boolean;
  hasVideo: boolean;
  readOnlyMode: boolean;
  onVideoEnd: () => void;
  onAnswerSelection?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
}
interface MediaInterface {
  mediaURL: string | null;
  hasVideo: boolean | undefined;
  onVideoEnd: () => void | undefined;
  controls: boolean;
}

export const MockExamQuestionLayout = ({
  questionDetails,
  selectedAnswer,
  showMedia,
  hasVideo,
  onVideoEnd,
  readOnlyMode,
  onAnswerSelection,
}: QuestionLayoutProps) => {
  const { answers } = questionDetails;
  const isAnsweredChecked = (answer: DtoMockExamQuestionAnswer) => {
    return (
      selectedAnswer === answer.id ||
      (answer.isCorrectAnswerOfId === answer.questionId && readOnlyMode)
    );
  };
  const getAnswerColor = (
    answer: DtoMockExamQuestionAnswer,
  ): 'primary' | 'success' | 'error' => {
    if (
      readOnlyMode &&
      (selectedAnswer === answer.id ||
        answer.isCorrectAnswerOfId === answer.questionId)
    ) {
      return answer.isCorrectAnswerOfId === answer.questionId
        ? 'success'
        : 'error';
    }
    return 'primary';
  };
  return (
    <>
      {showMedia && (
        <MediaContainer
          hasVideo={hasVideo}
          mediaURL={questionDetails.mediaReference}
          onVideoEnd={onVideoEnd}
          controls={readOnlyMode}
        />
      )}
      <Typography
        variant="h6"
        align="center"
        color={theme.palette.text.primary}
        sx={{
          width: '85%',
          margin: 'auto',
          marginTop: showMedia ? '8px' : 'auto',
          marginBottom: showMedia ? '8px' : 'auto',
        }}
      >
        {questionDetails.question}
      </Typography>
      <Flex
        alignItems="center"
        style={{ margin: '16px 0 16px 0' }}
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
                    checked={isAnsweredChecked(answer)}
                    color={getAnswerColor(answer)}
                    onChange={onAnswerSelection}
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
      </Flex>
    </>
  );
};

const MediaContainer = ({
  mediaURL,
  hasVideo,
  onVideoEnd,
  controls,
}: MediaInterface) => {
  return hasVideo ? (
    <StyledMediaWrapper elevation={1}>
      {mediaURL && (
        <StyledVideo
          width={700}
          src="/1A601.mov"
          onEnded={onVideoEnd}
          controls={controls}
          autoPlay
          muted
        />
      )}
      {!mediaURL && 'Brak Wideo'}
    </StyledMediaWrapper>
  ) : (
    <StyledMediaWrapper elevation={1}>
      {mediaURL && <StyledImage width={700} src="/3011pic-zt.jpg" alt="" />}
      {!mediaURL && 'Brak Zdjęcia'}
    </StyledMediaWrapper>
  );
};

const StyledMediaWrapper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: 1;
  aspect-ratio: 16/9;
  margin: auto;
  margin-top: 8px;
  margin-bottom: 24px;
  max-height: 50%;
  background: ${theme.palette.grey[300]};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
