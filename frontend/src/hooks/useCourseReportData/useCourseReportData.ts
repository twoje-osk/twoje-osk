import { GetCourseReportResponseDto } from '@osk/shared';
import { useEffect, useReducer } from 'react';
import useSWR from 'swr';
import { ReportGroup, RowData } from '../../components/Report/Report';
import { mapCourseReportDtoToReportGroups } from '../../components/Report/Report.utils';
import { assertNever } from '../../utils/asserNever';

// App State
interface CourseReportDataLoadingState {
  type: 'loading';
}

interface CourseReportDataErrorState {
  type: 'error';
}

interface CourseReportDataDoneState {
  type: 'done';
  groups: ReportGroup[];
  courseReportId: number;
}

type CourseReportDataState =
  | CourseReportDataLoadingState
  | CourseReportDataErrorState
  | CourseReportDataDoneState;

// App Actions
interface CourseReportDataStartLoadingAction {
  type: 'startLoadingAction';
}
interface CourseReportDataErrorAction {
  type: 'errorAction';
}
interface CourseReportDataDoneAction {
  type: 'doneAction';
  groups: ReportGroup[];
  courseReportId: number;
}
interface CourseReportDataUpdateRowAction {
  type: 'updateRowAction';
  rowId: number;
  done: boolean;
  mastered: boolean;
}
type CourseReportDataAction =
  | CourseReportDataStartLoadingAction
  | CourseReportDataErrorAction
  | CourseReportDataDoneAction
  | CourseReportDataUpdateRowAction;

const INITIAL_STATE: CourseReportDataState = { type: 'loading' };

export const useCourseReportData = (traineeId: number | null) => {
  const { data: reportData, error: reportError } =
    useSWR<GetCourseReportResponseDto>(
      traineeId ? `/api/course-reports/${traineeId}` : null,
    );

  const [data, dispatch] = useReducer(
    (
      prevState: CourseReportDataState,
      action: CourseReportDataAction,
    ): CourseReportDataState => {
      switch (action.type) {
        case 'startLoadingAction': {
          return {
            type: 'loading',
          };
        }
        case 'errorAction': {
          return {
            type: 'error',
          };
        }
        case 'doneAction': {
          return {
            type: 'done',
            groups: action.groups,
            courseReportId: action.courseReportId,
          };
        }
        case 'updateRowAction': {
          if (prevState.type !== 'done') {
            // eslint-disable-next-line no-console
            console.warn('Unexpected app state');
            return prevState;
          }

          const newGroups = prevState.groups.map(
            (group): ReportGroup => ({
              ...group,
              rows: group.rows.map((row): RowData => {
                if (row.id !== action.rowId) {
                  return row;
                }

                return {
                  id: row.id,
                  action: row.action,
                  done: action.done,
                  mastered: action.mastered,
                };
              }),
            }),
          );

          return {
            ...prevState,
            groups: newGroups,
          };
        }
        default: {
          return assertNever(action);
        }
      }
    },
    INITIAL_STATE,
  );

  useEffect(() => {
    if (reportData !== undefined) {
      dispatch({
        type: 'doneAction',
        groups: mapCourseReportDtoToReportGroups(reportData),
        courseReportId: reportData.courseReportId,
      });
      return;
    }

    if (reportError !== undefined) {
      dispatch({ type: 'errorAction' });
      return;
    }

    dispatch({ type: 'startLoadingAction' });
  }, [reportData, reportError]);

  const updateRow = (rowId: number, done: boolean, mastered: boolean) => {
    dispatch({ type: 'updateRowAction', rowId, done, mastered });
  };

  return [data, updateRow] as const;
};
