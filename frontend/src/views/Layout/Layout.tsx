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
  ListSubheader,
} from '@mui/material';
import { UserRole } from '@osk/shared/src/types/user.types';
import { ComponentProps, forwardRef, Fragment, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { StyledList } from './Layout.styled';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = '320px';

const LAYOUT_PADDING = '32px';
export const LAYOUT_HEIGHT = `calc(100vh - ${LAYOUT_PADDING} * 2)`;

interface MenuItem {
  text: string;
  icon: string;
  link: string;
  subheader?: string;
}

const menuItemsForRole: Record<UserRole, MenuItem[]> = {
  [UserRole.Admin]: [
    { text: 'Kursanci', icon: 'school', link: '/kursanci' },
    { text: 'Instruktorzy', icon: 'class', link: '/instruktorzy' },
    { text: 'Pojazdy', icon: 'directions_car', link: '/pojazdy' },
    { text: 'Ogłoszenia', icon: 'campaign', link: '/ogloszenia' },
    { text: 'Płatności', icon: 'attach_money', link: '/platnosci' },
  ],
  [UserRole.Instructor]: [
    { text: 'Moje Jazdy', icon: 'toys', link: '/moje-jazdy' },
    {
      text: 'Moja Dostępność',
      icon: 'event_available',
      link: '/moja-dostepnosc',
    },
    { text: 'Kursanci', icon: 'school', link: '/kursanci' },
    { text: 'Instruktorzy', icon: 'class', link: '/instruktorzy' },
    { text: 'Pojazdy', icon: 'directions_car', link: '/pojazdy' },
    { text: 'Ogłoszenia', icon: 'campaign', link: '/ogloszenia' },
  ],
  [UserRole.Trainee]: [
    { text: 'Moje Jazdy', icon: 'toys', link: '/moje-jazdy' },
    { text: 'Ogłoszenia', icon: 'campaign', link: '/ogloszenia' },
    { text: 'Moje Płatności', icon: 'attach_money', link: '/moje-platnosci' },
    {
      text: 'Egzaminy teoretyczne',
      subheader: 'E-learning',
      icon: 'checklist',
      link: '/egzaminy',
    },
    { text: 'Wykłady', icon: 'school', link: '/wyklady' },
  ],
};

export const Layout = ({ children }: LayoutProps) => {
  const { logOut, user, role } = useAuth();
  const menuItems = role ? menuItemsForRole[role] : [];
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
                <Fragment key={menuItem.text}>
                  {menuItem.subheader && (
                    <ListSubheader>{menuItem.subheader}</ListSubheader>
                  )}
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
                </Fragment>
              ))}
            </Box>
            <Box mb="8px">
              <Divider />
            </Box>
            <Box mb="16px">
              <ListItemButton component={NavLinkForMUI} to="/profil">
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
          <Flex width="100%" alignItems="center" p={LAYOUT_PADDING}>
            <Paper
              sx={{
                width: '100%',
                height: '100%',
                minHeight: LAYOUT_HEIGHT,
              }}
              elevation={1}
            >
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
