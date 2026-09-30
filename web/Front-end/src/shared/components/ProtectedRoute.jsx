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

export function RequireRole({ children }) {
    // Desactiva la validación de roles temporalmente dejando pasar todo
    return children;
}