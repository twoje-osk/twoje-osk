import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Icon,
  Typography,
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { DtoAnnouncement } from '@osk/shared';
import { UserRole } from '@osk/shared/src/types/user.types';
import { useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { formatLong } from '../../../utils/date';

interface AnnouncementCardProps {
  announcement: DtoAnnouncement;
  handleDelete: () => void;
  handleEdit: () => void;
}

export const AnnouncementCard = ({
  announcement,
  handleDelete,
  handleEdit,
}: AnnouncementCardProps) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useAuth();
  const userInitials = `${announcement.createdBy.firstName.charAt(
    0,
  )}${announcement.createdBy.lastName.charAt(0)}`;
  const subheader = `${formatLong(new Date(announcement.createdAt))}, ${
    announcement.createdBy.firstName
  } ${announcement.createdBy.lastName}`;

  const onDelete = () => {
    setIsMenuOpen(false);
    handleDelete();
  };

  const onEdit = () => {
    setIsMenuOpen(false);
    handleEdit();
  };

  return (
    <Card
      sx={{
        mx: '15rem',
        my: '2rem',
        bgColor: '#fafafa',
      }}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: blue[100] }}>{userInitials}</Avatar>}
        action={
          role === UserRole.Admin && (
            <IconButton
              aria-label="settings"
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(true)}
            >
              <Icon fontSize="small" color="disabled">
                more_vert
              </Icon>
            </IconButton>
          )
        }
        title={<Typography variant="h6">{announcement.subject}</Typography>}
        subheader={subheader}
        id={announcement.id}
      />
      <CardContent>
        <Typography variant="body2" sx={{ mx: '16px', whiteSpace: 'pre-wrap' }}>
          {announcement.body}
        </Typography>
      </CardContent>
      <Menu
        id="basic-menu"
        anchorEl={menuButtonRef.current}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        transitionDuration={85}
      >
        <MenuItem onClick={onEdit}>
          <ListItemIcon>
            <Icon>edit</Icon>
          </ListItemIcon>
          <ListItemText>Edytuj</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <Icon>delete</Icon>
          </ListItemIcon>
          <ListItemText>Usuń</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};
