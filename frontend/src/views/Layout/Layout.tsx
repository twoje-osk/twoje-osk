import {
  Divider,
  Drawer,
  ListItem,
  ListItemText,
  Icon,
  ListItemIcon,
  ListItemButton,
  Container,
  Paper,
} from '@mui/material';
import { ComponentProps, forwardRef, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { StyledList } from './Layout.styled';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = '320px';

export const Layout = ({ children }: LayoutProps) => {
  const menuItems = [
    { text: 'Instruktorzy', icon: 'class', link: '/instruktorzy' },
    { text: 'Kursanci', icon: 'school', link: '/kursanci' },
    { text: 'Pojazdy', icon: 'directions_car', link: '' },
    { text: 'Ogłoszenia', icon: 'campaign', link: '' },
  ];
  const { logOut, user } = useAuth();
  const userFullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <Flex>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <StyledList disablePadding component="nav">
          <Flex flexDirection="column" height="100%">
            <ListItem sx={{ height: 64 }}>
              <ListItemIcon className="logo">
                <Icon sx={{ fontSize: 32 }}>car_rental</Icon>
              </ListItemIcon>
              <ListItemText
                sx={{ my: 0 }}
                primary={user?.organization.name}
                primaryTypographyProps={{
                  fontSize: 20,
                  fontWeight: 'medium',
                  letterSpacing: 0,
                }}
              />
            </ListItem>
            <Box mb="8px">
              <Divider />
            </Box>
            <Box flexGrow="1">
              {menuItems.map((menuItem) => (
                <ListItemButton
                  key={menuItem.text}
                  component={NavLinkForMUI}
                  to={menuItem.link}
                >
                  <ListItemIcon>
                    <Icon>{menuItem.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={menuItem.text} />
                </ListItemButton>
              ))}
            </Box>
            <Box mb="8px">
              <Divider />
            </Box>
            <Box mb="16px">
              <ListItemButton>
                <ListItemIcon>
                  <Icon>account_circle</Icon>
                </ListItemIcon>
                <ListItemText primary={userFullName} />
              </ListItemButton>
              <ListItemButton onClick={logOut}>
                <ListItemIcon>
                  <Icon>logout</Icon>
                </ListItemIcon>
                <ListItemText primary="Wyloguj się" />
              </ListItemButton>
            </Box>
          </Flex>
        </StyledList>
      </Drawer>
      <Box flexGrow="1">
        <Container maxWidth="xl">
          <Flex width="100%" height="100vh" alignItems="center" p="32px">
            <Paper sx={{ width: '100%', height: '100%' }} elevation={1}>
              {children}
            </Paper>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
};

const NavLinkForMUI = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof NavLink>
>((props, ref) => {
  return (
    <NavLink
      ref={ref}
      {...props}
      className={({ isActive }) =>
        [props.className, ...(isActive ? ['Mui-selected'] : [])].join(' ')
      }
    />
  );
});
