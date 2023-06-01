import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from '@mui/material';
import styled from '@emotion/styled';

export const Accordion = styled(MuiAccordion)`
  &.MuiAccordion-root {
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: none;

    &:not(:last-child) {
      border-bottom: 0;
    }

    &:before {
      display: none;
    }
  }
`;

export const AccordionSummary = styled(MuiAccordionSummary)`
  &.MuiAccordionSummary-root {
    background-color: rgba(0, 0, 0, 0.03);
    min-height: 56px;

    &.Mui-expanded {
      min-height: 56px;
    }
  }

  .MuiAccordionSummary-content {
    &.Mui-expanded {
      margin: 12px 0;
    }
  }
`;

export const AccordionDetails = styled(MuiAccordionDetails)`
  &.MuiAccordionDetails-root {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    padding: 16px;
  }
`;
