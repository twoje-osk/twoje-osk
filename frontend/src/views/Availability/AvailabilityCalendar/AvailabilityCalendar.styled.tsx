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
    cursor: grab;
  }

  .rbc-addons-dnd-drag-preview {
    cursor: grabbing;
  }

  .rbc-addons-dnd-resizable {
    display: flex;
    flex-direction: column;
  }

  .rbc-event-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 11px;
  }
`;

export const WhiteButtonWrapper = styled.div`
  background: white;
  border-radius: 4px;
  margin: 0px 8px;
  width: 100%;
`;
