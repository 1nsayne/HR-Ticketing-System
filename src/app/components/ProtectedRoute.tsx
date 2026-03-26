import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

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

  if (!user) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
