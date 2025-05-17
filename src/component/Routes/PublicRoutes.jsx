import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({children}) => {
    const { authUser, ischeckingAuth } = useAuthStore();

    if (ischeckingAuth) {
        return (
          <div className="flex items-center justify-center h-screen">
            <span className="loader" />
          </div>
        );
      }
    
      return !authUser ? children : <Navigate to="/" replace />;
}

export default PublicRoutes