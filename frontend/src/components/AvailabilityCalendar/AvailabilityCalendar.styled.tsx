import styled from '@emotion/styled';
import type { green } from '@mui/material/colors';

export type EventColor = Record<keyof typeof green, string>;

export const StylingWrapper = styled.div<{ eventColor: EventColor }>`
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
    background: ${({ eventColor }) => eventColor[500]};
    border-color: ${({ eventColor }) => eventColor[600]};
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
