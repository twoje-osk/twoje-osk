import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Icon,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { useAuth } from '../../hooks/useAuth/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const menuItems = [
    { text: 'Instruktorzy', icon: 'class', link: '/instruktorzy' },
    { text: 'Kursanci', icon: 'school', link: '' },
    { text: 'Pojazdy', icon: 'directions_car', link: '' },
    { text: 'Ogłoszenia', icon: 'event_note', link: '' },
  ];
  const { logOut, user } = useAuth();

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
            {user.organizationName}
          </Typography>
        </Flex>
        <Divider />
        <Box pt="1.5rem" px="1rem">
          <List>
            {menuItems.map((element) => (
              <ListItemButton
                key={element.text}
                component={Link}
                to={element.link}
              >
                <ListItemIcon>
                  <Icon sx={{ fontSize: 32, color: 'black' }}>
                    {element.icon}
                  </Icon>
                </ListItemIcon>
                <ListItemText primary={element.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Flex height="100vh" px="1rem" alignItems="flex-end">
          <List>
            <ListItem button>
              <ListItemIcon>
                <Icon sx={{ fontSize: 32, color: 'black' }}>
                  account_circle
                </Icon>
              </ListItemIcon>
              <ListItemText primary={user.username} />
            </ListItem>
            <ListItem button onClick={logOut}>
              <ListItemIcon>
                <Icon sx={{ fontSize: 32, color: 'black' }}>logout</Icon>
              </ListItemIcon>
              <ListItemText primary="Wyloguj się" />
            </ListItem>
          </List>
        </Flex>
      </Drawer>
      {children}
    </Flex>
  );
};
