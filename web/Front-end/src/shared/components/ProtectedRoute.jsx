import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

function SessionLoading() {
    return <p className="route-loading">Cargando sesión...</p>;
}

export function RequireAuth({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <SessionLoading />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}

export function RequireRole({ children, roles = [] }) {
    const { user, isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <SessionLoading />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (!hasRole(...roles)) {
        const fallbackPath =
            user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
                ? "/HomeAdmin"
                : "/home";

        return <Navigate to={fallbackPath} replace />;
    }

    return children;
}
