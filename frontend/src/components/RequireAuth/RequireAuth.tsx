import { Location, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth/useAuth';

export interface RequireAuthLocationState {
  from: Location;
}

export const RequireAuth = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    const navigationState: RequireAuthLocationState = {
      from: location,
    };

    return <Navigate to="/login" replace state={navigationState} />;
  }

  return <Outlet />;
};
