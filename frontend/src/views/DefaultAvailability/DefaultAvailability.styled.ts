import styled from '@emotion/styled';
import { LAYOUT_HEIGHT } from '../Layout/Layout';

export const CalendarWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

export const FullPageRelativeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: ${LAYOUT_HEIGHT};
  padding: 32px;
`;
