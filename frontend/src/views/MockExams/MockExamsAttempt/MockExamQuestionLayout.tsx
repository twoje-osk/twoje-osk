import { MockExamQuestionDto } from '@osk/shared';
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
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        {questionDetails.question}
      </Typography>
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
                    onChange={onAnswerSelection}
                    value={answer.id.toString()}
                    inputProps={{ type: 'radio' }}
                    name="answer"
                    disabled={readOnlyMode}
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
  margin-bottom: 48px;
  max-height: 500px;
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
