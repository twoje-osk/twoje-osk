import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

export interface RowData {
  action: string;
  done: boolean;
  mastered: boolean;
}

interface ReportProps {
  rows: RowData[];
}
export const Report = ({ rows }: ReportProps) => {
  return (
    <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
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
            <TraineeReportRow key={row.action} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface TraineeReportRowProps {
  row: RowData;
}
const TraineeReportRow = ({ row }: TraineeReportRowProps) => {
  const [isDoneInternallyChecked, setIsDoneInternallyChecked] = useState(
    row.done,
  );
  const [isMasteredInternallyChecked, setMasteredIsInternallyChecked] =
    useState(row.mastered);

  const onDoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDoneInternallyChecked(event.target.checked);
  };
  const onMasteredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMasteredIsInternallyChecked(event.target.checked);
  };

  useEffect(() => {
    setIsDoneInternallyChecked(row.done);
  }, [row.done]);

  useEffect(() => {
    setMasteredIsInternallyChecked(row.mastered);
  }, [row.mastered]);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {row.action}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox checked={isDoneInternallyChecked} onChange={onDoneChange} />
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <Checkbox
          checked={isMasteredInternallyChecked}
          onChange={onMasteredChange}
        />
      </TableCell>
    </TableRow>
  );
};
