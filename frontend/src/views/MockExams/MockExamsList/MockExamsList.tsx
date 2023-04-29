import {
  Toolbar,
  Typography,
  Stack,
  Button,
  Icon,
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { MockExamAttemptFindAllResponseDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatLong } from '../../../utils/date';

export const MockExamsList = () => {
  const pageTitle = 'Próbne egzaminy teoretyczne';
  const PERFECT_SCORE = 74;

  const { data: mockExamsListData, error: mockExamsListError } =
    useSWR<MockExamAttemptFindAllResponseDto>('/api/exams');

  const navigate = useNavigate();

  if (mockExamsListError) {
    return <GeneralAPIError />;
  }

  if (mockExamsListData === undefined) {
    return <FullPageLoading />;
  }

  const { examAttempts } = mockExamsListData;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="h1">
          {pageTitle}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowy"
          >
            Rozwiąż próbny egzamin teoretyczny
          </Button>
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista egzaminów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Wynik</TableCell>
              <TableCell>Punktacja</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examAttempts.map((mockExam) => (
              <TableRow
                hover
                key={mockExam.id}
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`./${mockExam.id}`)}
              >
                <TableCell align="center">
                  {mockExam.isPassed ? (
                    <Icon color="success">check</Icon>
                  ) : (
                    <Icon color="error">close</Icon>
                  )}
                </TableCell>
                <TableCell>
                  {mockExam.isPassed ? 'Pozytywny' : 'Negatywny'}
                </TableCell>
                <TableCell>
                  {mockExam.score}/{PERFECT_SCORE}
                </TableCell>
                <TableCell>
                  {formatLong(parseISO(mockExam.attemptDate))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
