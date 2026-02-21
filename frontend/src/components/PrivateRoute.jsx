import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on role
    switch(user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'store_owner':
        return <Navigate to="/owner/dashboard" />;
      case 'normal_user':
        return <Navigate to="/user/dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default PrivateRoute;