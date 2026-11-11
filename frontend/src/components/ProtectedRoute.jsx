import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin" />
          <p className="text-sm font-serif text-maroon-900 tracking-wide">
            Consulting the celestial realm...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If attempting to access executive portal, redirect to executive login
    const loginTarget = requiredRole === 'EXECUTIVE' ? '/executive/login' : '/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // Role validation
  if (requiredRole && user.role !== requiredRole) {
    // Redirect executive away from customer dashboard, or customer away from executive dashboard
    const fallbackTarget = user.role === 'EXECUTIVE' ? '/executive/dashboard' : '/dashboard';
    return <Navigate to={fallbackTarget} replace />;
  }

  return children;
};

export default ProtectedRoute;
