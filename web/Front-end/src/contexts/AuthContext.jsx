/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { authService } from "../features/auth/services/authService";
import {
    clearSession,
    getStoredRefreshToken,
    saveSession,
} from "../features/auth/services/sessionStorage";
import { tokenStore } from "../shared/api/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const restoreStarted = useRef(false);

    const clearLocalAuth = useCallback(() => {
        tokenStore.clear();
        clearSession();
        setUser(null);
    }, []);

    const restoreSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const refreshToken = getStoredRefreshToken();

            if (!refreshToken) {
                return;
            }

            await authService.refreshSession();
            const profile = await authService.getProfile();

            setUser(profile);
        } catch (restoreError) {
            clearLocalAuth();
            setError(
                restoreError?.message ??
                    "No fue posible restaurar la sesión."
            );
        } finally {
            setIsLoading(false);
        }
    }, [clearLocalAuth]);

    useEffect(() => {
        if (restoreStarted.current) {
            return;
        }

        restoreStarted.current = true;

        // La restauración sincroniza el estado inicial con la sesión remota.
        restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        tokenStore.setOnRefreshFail(() => {
            clearLocalAuth();
            setError("Tu sesión expiró. Inicia sesión nuevamente.");
        });

        return () => {
            tokenStore.setOnRefreshFail(() => {});
        };
    }, [clearLocalAuth]);

    const login = useCallback(async (credentials) => {
        setError(null);
        const session = await authService.login(credentials);
        setUser(session.user);
        return session;
    }, []);

    const register = useCallback(async (formData) => {
        setError(null);
        const session = await authService.register(formData);
        setUser(session.user);
        return session;
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        clearLocalAuth();
    }, [clearLocalAuth]);

    const refreshProfile = useCallback(async () => {
        setError(null);

        try {
            const profile = await authService.getProfile();
            setUser(profile);
            return profile;
        } catch (profileError) {
            setError(
                profileError?.message ??
                    "No fue posible cargar el perfil."
            );
            throw profileError;
        }
    }, []);

    /**
     * Guarda los cambios del perfil y sincroniza el estado global con lo que
     * devolvio el servidor, para que el resto de la app vea el nombre nuevo
     * sin tener que recargar.
     */
    const updateProfile = useCallback(async (changes) => {
        setError(null);

        try {
            const updated = await authService.updateProfile(changes);
            setUser(updated);
            saveSession({ user: updated });
            return updated;
        } catch (profileError) {
            setError(
                profileError?.message ??
                    "No fue posible guardar el perfil."
            );
            throw profileError;
        }
    }, []);

    const hasRole = useCallback(
        (...roles) => roles.includes(user?.role),
        [user?.role]
    );

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isLoading,
            error,
            login,
            register,
            logout,
            restoreSession,
            refreshProfile,
            updateProfile,
            hasRole,
            clearError: () => setError(null),
        }),
        [
            user,
            isLoading,
            error,
            login,
            register,
            logout,
            restoreSession,
            refreshProfile,
            updateProfile,
            hasRole,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe utilizarse dentro de AuthProvider");
    }

    return context;
}
