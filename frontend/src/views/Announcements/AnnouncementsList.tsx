import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { AnnouncementFindAllResponseDto, DtoAnnouncement } from '@osk/shared';
import { Box, Flex } from 'reflexbox';
import useSWR from 'swr';
import { useState } from 'react';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useActionModal } from '../../hooks/useActionModal/useActionModal';
import { formatLong } from '../../utils/date';

export const AnnouncementsList = () => {
  const { data: announcementsData, error: announcementsError } =
    useSWR<AnnouncementFindAllResponseDto>('/api/announcements');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pageTitle = 'Ogłoszenia';
  const {
    // setLoading: setCreateModalLoading,
    // isLoading: isCreateModalLoading,
    // isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    // closeModal: closeCreateModal,
  } = useActionModal();

  if (announcementsError) {
    return <GeneralAPIError />;
  }

  if (announcementsData === undefined) {
    return <FullPageLoading />;
  }

  const { announcements } = announcementsData;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          mb: '2rem',
        }}
      >
        <Typography sx={{ flex: '1 1 30%' }} variant="h6" component="h1">
          {pageTitle}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            onClick={openCreateModal}
          >
            Dodaj Nowe Ogłoszenie
          </Button>
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Box style={{ overflow: 'auto' }}>
        <Stack direction="column">
          {announcements.map((announcement: DtoAnnouncement) => {
            return (
              <Card
                key={announcement.id}
                sx={{
                  minWidth: '60%',
                  maxWidth: '60%',
                  margin: 'auto',
                  mb: '3rem',
                  bgColor: '#fafafa',
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: blue[100] }}>
                      {`${announcement.createdBy.firstName.charAt(
                        0,
                      )}${announcement.createdBy.lastName.charAt(0)}`}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                      <Icon fontSize="small" color="disabled">
                        menu
                      </Icon>
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6">{announcement.subject}</Typography>
                  }
                  subheader={`${formatLong(
                    new Date(announcement.createdAt),
                  )}, ${announcement.createdBy.firstName} ${
                    announcement.createdBy.lastName
                  }`}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ mx: 'auto', maxWidth: '95%' }}
                  >
                    {announcement.body}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transitionDuration={85}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText>Edytuj</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Icon>delete</Icon>
              </ListItemIcon>
              <ListItemText>Usuń</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Flex>
  );
};
