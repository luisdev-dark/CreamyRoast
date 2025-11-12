import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/users';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER]
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero no tiene el rol requerido, redirigir al dashboard por defecto
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    // Redirigir según el rol del usuario
    let redirectTo = '/pos';
    if (user.role === UserRole.ADMIN) {
      redirectTo = '/admin';
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;