import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    user: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user }) => {
    // Routes are now accessible to both authenticated and unauthenticated users
    // Unauthenticated users will use local storage for data
    return <Outlet />;
};

export default ProtectedRoute;
