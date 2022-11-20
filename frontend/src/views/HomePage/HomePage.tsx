import { UserRole } from '@osk/shared/src/types/user.types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth/useAuth';

export const HomePage = () => {
  const { role } = useAuth();

  if (role === UserRole.Admin) {
    return <Navigate to="/kursanci" replace />;
  }

  if (role === UserRole.Instructor) {
    return <Navigate to="/moje-jazdy" replace />;
  }

  if (role === UserRole.Trainee) {
    return <Navigate to="/moje-jazdy" replace />;
  }

  return <Navigate to="/login" replace />;
};
