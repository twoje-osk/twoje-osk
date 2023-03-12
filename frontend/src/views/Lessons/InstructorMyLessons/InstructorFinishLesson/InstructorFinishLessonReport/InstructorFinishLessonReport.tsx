import { Alert, AlertTitle } from '@mui/material';
import { Flex } from 'reflexbox';
import { FullPageLoading } from '../../../../../components/FullPageLoading/FullPageLoading';
import { Report } from '../../../../../components/Report/Report';
import { useCourseReportData } from '../../../../../hooks/useCourseReportData/useCourseReportData';

interface InstructorFinishLessonReportProps {
  traineeId: number;
}

export const InstructorFinishLessonReport = ({
  traineeId,
}: InstructorFinishLessonReportProps) => {
  const [data, updateRow] = useCourseReportData(traineeId ?? null);

  if (data.type === 'error') {
    return (
      <Flex p="16px" width="100%" height="100%" flexDirection="column">
        <Alert severity="error">
          <AlertTitle>Wystąpił błąd</AlertTitle>
          Prosimy spróbuj ponownie później
        </Alert>
      </Flex>
    );
  }

  if (data.type === 'loading') {
    return <FullPageLoading />;
  }

  return <Report groups={data.groups} onChange={updateRow} />;
};
