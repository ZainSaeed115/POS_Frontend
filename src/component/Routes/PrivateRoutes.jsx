import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({children}) => {
    const { authUser, ischeckingAuth } = useAuthStore();
    console.log("user data:",authUser)
    if (ischeckingAuth) {
        return (
          <div className="flex items-center justify-center h-screen">
            <span className="loader" /> 
          </div>
        );
      }
    
      return authUser ? children : <Navigate to="/login" replace />;
}

export default PrivateRoutes