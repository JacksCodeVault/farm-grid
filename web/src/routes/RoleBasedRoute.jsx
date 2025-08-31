import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleBasedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" />;
  return <Outlet />;
}
