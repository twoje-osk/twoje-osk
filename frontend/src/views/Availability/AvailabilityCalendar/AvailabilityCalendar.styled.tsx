import styled from '@emotion/styled';
import { green } from '@mui/material/colors';

export const StylingWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .rbc-background-event {
    pointer-events: none;
  }

  .rbc-allday-cell {
    display: none;
  }

  .rbc-time-header-cell .rbc-header {
    border-bottom: none;
  }

  .rbc-toolbar {
    display: none;
  }

  .rbc-time-slot {
    min-height: 32px;
  }

  .rbc-current-time-indicator {
    display: none;
  }

  .rbc-event {
    background: ${green[500]};
    border-color: ${green[600]};
  }
`;
