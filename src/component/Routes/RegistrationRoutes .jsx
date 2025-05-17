import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';

const RegistrationRoutes = ({ children }) => {
    const { authUser, isCheckingAuth, registrationInProgress } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loader" />
            </div>
        );
    }

    // Allow access if:
    // - No user is logged in (new registration)
    // - OR registration is in progress (multi-step registration)
    return (!authUser || registrationInProgress) ? children : <Navigate to="/" replace />;
};

export default RegistrationRoutes;