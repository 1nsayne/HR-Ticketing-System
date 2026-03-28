import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectToRoleHome?: boolean;
}

const getRouteForRole = (role: UserRole) => {
  if (role === 'admin') return '/admin';
  if (role === 'hr') return '/hr';
  return '/employee';
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectToRoleHome = false,
}) => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) {
    if (redirectToRoleHome) {
      return <Navigate to={getRouteForRole(role)} replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
