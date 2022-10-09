import styled from '@emotion/styled';

export const ForgotPasswordHiddenWrapper = styled.div`
  opacity: 1;
  transition: opacity 0.2s ease-in-out;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

export const ForgotPasswordLoaderWrapper = styled(ForgotPasswordHiddenWrapper)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
