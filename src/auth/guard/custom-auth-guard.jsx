import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { paths } from 'src/routes/paths';

const ProtectedRoute = ({ children, requiredPermission }) => {

    const { user } = useSelector((state) => state.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const hasPermission = Array.isArray(requiredPermission) ? requiredPermission.includes(user?.permission) : user?.permission === requiredPermission;

    if (!hasPermission) {
        return <Navigate to="/404" replace />;
    }

    // Render children or nested routes if all checks pass
    return children || <Outlet />;
};

export default ProtectedRoute;

// Sends a logged-in user to their dashboard; renders children (e.g. landing) otherwise.
export const RedirectIfLoggedIn = ({ children }) => {

    const { user } = useSelector((state) => state.user);

    if (user?.permission === 1) {
        return <Navigate to={paths.adminDashboard.root} replace />;
    }

    if (user?.permission === 2) {
        return <Navigate to={paths.dashboard.root} replace />;
    }

    return children;
};
