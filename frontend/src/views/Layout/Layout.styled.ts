import styled from '@emotion/styled';
import { List } from '@mui/material';

export const StyledList = styled(List)<{ component?: React.ElementType }>({
  height: '100%',
  '& .MuiListItemButton-root, & .MuiListItem-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root:not(.logo)': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiListItemIcon-root.logo': {
    minWidth: 0,
    marginRight: 12,
    marginLeft: -4,
  },
});
