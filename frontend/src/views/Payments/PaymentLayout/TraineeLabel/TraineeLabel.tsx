import { Typography, Chip } from '@mui/material';
import { TraineeDto } from '@osk/shared';
import { Link } from 'react-router-dom';
import { Box } from 'reflexbox';

interface TraineeLabelProps {
  trainee: TraineeDto;
}
export const TraineeLabel = ({ trainee }: TraineeLabelProps) => {
  return (
    <Box marginTop="-8px">
      <Typography variant="caption">Kursant</Typography>
      <div>
        <Chip
          to={`/kursanci/${trainee.id}/platnosci`}
          component={Link}
          label={`${trainee.user.firstName} ${trainee.user.lastName}`}
          clickable
        />
      </div>
    </Box>
  );
};
