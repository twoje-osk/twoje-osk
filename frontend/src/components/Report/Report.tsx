import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Typography } from '@mui/material';
import { Box } from 'reflexbox';
import { useEffect, useState } from 'react';
import { ReportEntryToCourseReportCreateOrUpdateRequestDto } from '@osk/shared';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';

export interface RowData {
  id: number;
  action: string;
  done: boolean;
  mastered: boolean;
}

export interface ReportGroup {
  description: string;
  rows: RowData[];
}

interface ReportProps {
  groups: ReportGroup[];
  courseReportId: number;
}
export const Report = ({ groups, courseReportId }: ReportProps) => {
  return (
    <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
      {groups.map(({ description, rows }) => (
        <Box paddingBottom={3} key={description}>
          <Box paddingX={3} marginBottom={2}>
            <Typography variant="h5" component="h2">
              {description}
            </Typography>
          </Box>
          <Table aria-label="Raport" stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Czynność</TableCell>
                <TableCell align="center">Przetrenowane</TableCell>
                <TableCell align="center">Opanowane</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TraineeReportRow
                  key={row.id}
                  row={row}
                  courseReportId={courseReportId}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}
    </TableContainer>
  );
};

interface TraineeReportRowProps {
  row: RowData;
  courseReportId: number;
}
const TraineeReportRow = ({ row, courseReportId }: TraineeReportRowProps) => {
  const [rowData, setRowData] = useState(row);
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar } = useCommonSnackbars();

  useEffect(() => {
    setRowData(row);
  }, [row]);

  const makeUpdateApiRequest = (done: boolean, mastered: boolean) => {
    const body: ReportEntryToCourseReportCreateOrUpdateRequestDto = {
      courseReportId,
      reportEntryId: row.id,
      done,
      mastered,
    };

    // TODO: Add response type
    return makeRequestWithAuth<
      any,
      ReportEntryToCourseReportCreateOrUpdateRequestDto
    >('/api/report-entry-to-course-report', 'PUT', body);
  };

  const onDoneChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const oldDone = rowData.done;
    const newDone = event.target.checked;
    setRowData({ ...rowData, done: newDone });

    const response = await makeUpdateApiRequest(newDone, rowData.mastered);

    if (!response.ok) {
      setRowData((oldRowData) => ({ ...oldRowData, done: oldDone }));
      showErrorSnackbar();
    }
  };

  const onMasteredChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const oldMastered = rowData.mastered;
    const newMastered = event.target.checked;
    setRowData({ ...rowData, mastered: newMastered });

    const response = await makeUpdateApiRequest(rowData.done, newMastered);

    if (!response.ok) {
      setRowData((oldRowData) => ({ ...oldRowData, mastered: oldMastered }));
      showErrorSnackbar();
    }
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {rowData.action}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox checked={rowData.done} onChange={onDoneChange} />
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox checked={rowData.mastered} onChange={onMasteredChange} />
      </TableCell>
    </TableRow>
  );
};
