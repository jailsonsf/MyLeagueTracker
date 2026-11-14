import { Navigate, Outlet } from '@tanstack/react-router';

import { useAuth } from '../features/auth/authContext';

export function AuthenticatedLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
