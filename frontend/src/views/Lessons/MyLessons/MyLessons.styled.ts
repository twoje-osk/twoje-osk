import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const FullPageRelativeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;
`;

export const CalendarWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

export const LoaderOverlay = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
`;

export const GroupedIconButton = styled(Button)`
  padding-left: 5px;
  padding-right: 5px;
`;
