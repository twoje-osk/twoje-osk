import useSWR from 'swr';
import { MockExamAttemptFindOneResponseDto } from '@osk/shared';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Flex } from 'reflexbox';
import { Button, Icon, Stack, Toolbar, Typography } from '@mui/material';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { theme } from '../../../theme';
import { PERFECT_SCORE } from '../MockExams.constants';

export const MockExamsScoreBoard = () => {
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

  const result = attemptData.examAttempt.isPassed;
  const { score } = attemptData.examAttempt;

  const navigateToAnswers = () => {
    navigate(`/egzaminy/${examId}`);
  };
  const navigateToResultsList = () => {
    navigate(`/egzaminy`);
  };

  return (
    <Flex
      flexDirection="column"
      style={{ height: '100%', paddingTop: '8px', paddingBottom: '8px' }}
    >
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          mr: { sm: 2 },
          justifyContent: 'end',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="../../egzaminy/nowy"
          >
            Nowe podejście
          </Button>
        </Stack>
      </Toolbar>
      {result && (
        <Typography
          variant="h2"
          align="center"
          fontWeight="bold"
          color={theme.palette.success.main}
          sx={{
            width: '85%',
            margin: 'auto',
            marginTop: 'auto',
            marginBottom: '8px',
          }}
        >
          POZYTYWNY
        </Typography>
      )}
      {!result && (
        <Typography
          variant="h2"
          align="center"
          fontWeight="bold"
          color={theme.palette.error.main}
          sx={{
            width: '85%',
            margin: 'auto',
            marginTop: 'auto',
            marginBottom: '8px',
          }}
        >
          NEGATYWNY
        </Typography>
      )}
      <Typography
        variant="h5"
        align="center"
        color={theme.palette.text.primary}
        sx={{
          width: '85%',
          margin: 'auto',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        Uzyskany wynik to {score} / {PERFECT_SCORE} pkt
      </Typography>
      <Flex style={{ margin: '32px 0 auto 0' }}>
        <Button
          variant="outlined"
          style={{ margin: '8px 8px 0 auto' }}
          onClick={navigateToResultsList}
        >
          Wróć do listy wyników
        </Button>
        <Button
          variant="contained"
          style={{ margin: '8px auto 0 8px' }}
          onClick={navigateToAnswers}
        >
          Sprawdź swoje odpowiedzi
        </Button>
      </Flex>
    </Flex>
  );
};
