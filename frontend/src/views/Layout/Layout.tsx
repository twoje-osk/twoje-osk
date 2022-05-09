import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Icon,
} from '@mui/material';
import { ReactNode } from 'react';
import { Box, Flex } from 'reflexbox';

interface MyComponentProps {
  children: ReactNode;
}

export const Layout = ({ children }: MyComponentProps) => {
  const oskName = 'OSK Adam Nowak';
  const menuItems = ['Instruktorzy', 'Kursanci', 'Pojazdy', 'Ogłoszenia'];

  return (
    <Flex width="100%" height="100vh" alignItems="center">
      <Drawer
        sx={{
          width: '20rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '20rem',
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Flex py="1.5rem" justifyContent="center" alignItems="center">
          <Flex mr="1rem">
            <Icon sx={{ fontSize: 48 }}>car_rental</Icon>
          </Flex>
          <Typography variant="h5" component="h1">
            {oskName}
          </Typography>
        </Flex>
        <Divider />
        <Box pt="1.5rem" pl="1rem">
          <List>
            {menuItems.map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Flex height="100vh" pl="1rem" alignItems="flex-end">
          <List>
            <ListItem button>
              <ListItemText primary="Profil" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Wyloguj się" />
            </ListItem>
          </List>
        </Flex>
      </Drawer>
      {children}
    </Flex>
  );
};
