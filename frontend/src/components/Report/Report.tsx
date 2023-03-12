import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Typography } from '@mui/material';
import { Box } from 'reflexbox';

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
  onChange: (rowId: number, done: boolean, mastered: boolean) => void;
}
export const Report = ({ groups, onChange }: ReportProps) => {
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
                <TraineeReportRow key={row.id} row={row} onChange={onChange} />
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
  onChange: (rowId: number, done: boolean, mastered: boolean) => void;
}
const TraineeReportRow = ({ row, onChange }: TraineeReportRowProps) => {
  const onDoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDone = event.target.checked;
    onChange(row.id, newDone, row.mastered);
  };
  const onMasteredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMastered = event.target.checked;
    onChange(row.id, row.done, newMastered);
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {row.action}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox checked={row.done} onChange={onDoneChange} />
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox checked={row.mastered} onChange={onMasteredChange} />
      </TableCell>
    </TableRow>
  );
};
