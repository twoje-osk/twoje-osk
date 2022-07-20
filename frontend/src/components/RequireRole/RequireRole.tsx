import { UserRole } from '@osk/shared/src/types/user.types';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth/useAuth';

export type RequireRoleProps =
  | {
      role: UserRole;
      roles?: never;
    }
  | {
      role?: never;
      roles: UserRole[];
    };

export const RequireRole = ({
  role: requiredRole,
  roles: requiredRolesList,
}: RequireRoleProps) => {
  const { role } = useAuth();

  if (role === null) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole !== undefined && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredRolesList !== undefined && !requiredRolesList.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
