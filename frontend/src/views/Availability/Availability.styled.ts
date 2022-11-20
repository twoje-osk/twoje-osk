import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const CalendarWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

export const FullPageRelativeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
`;

export const GroupedIconButton = styled(Button)`
  padding-left: 5px;
  padding-right: 5px;
`;
