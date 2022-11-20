import { UserRole } from '@osk/shared/src/types/user.types';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { InstructorMyLessons } from '../InstructorMyLessons/InstructorMyLessons';
import { TraineeMyLessons } from '../TraineeMyLessons/TraineeMyLessons';

export const MyLessons = () => {
  const { role } = useAuth();

  if (role === UserRole.Trainee) {
    return <TraineeMyLessons />;
  }

  if (role === UserRole.Instructor) {
    return <InstructorMyLessons />;
  }

  return null;
};
