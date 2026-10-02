import { httpClient } from "../../../shared/api/httpClient";
import { tokenStore } from "../../../shared/api/tokenStore";
import { toLoginPayload, toRegisterPayload, toAuthUserViewModel } from "./authMapper";
import {
    saveSession,
    getStoredUser,
    getStoredRefreshToken,
    clearSession,
} from "./sessionStorage";

const RESOURCE = "/auth";

export const authService = {
    async login(credentials) {
        const response = await httpClient.post(
            `${RESOURCE}/login`,
            toLoginPayload(credentials)
        );
        const user = toAuthUserViewModel(response);

        tokenStore.setAccessToken(response.accessToken);
        saveSession({
            refreshToken: response.refreshToken,
            user,
        });

        return { user };
    },

    async register(formData) {
        const response = await httpClient.post(
            `${RESOURCE}/register`,
            toRegisterPayload(formData)
        );
        const user = toAuthUserViewModel(response);

        tokenStore.setAccessToken(response.accessToken);
        saveSession({
            refreshToken: response.refreshToken,
            user,
        });

        return { user };
    },

    async refreshSession() {
        const refreshToken = getStoredRefreshToken();

        if (!refreshToken) {
            throw new Error("No hay refresh token");
        }

        const response = await httpClient.post(
            `${RESOURCE}/refresh`,
            { refreshToken }
        );

        tokenStore.setAccessToken(response.accessToken);
        saveSession({ refreshToken: response.refreshToken });
        return response;
    },

    async logout() {
        const refreshToken = getStoredRefreshToken();

        if (refreshToken) {
            try {
                await httpClient.post(`${RESOURCE}/logout`, { refreshToken });
            } catch {
                // La sesión local se limpia aunque el servidor no responda.
            }
        }

        tokenStore.clear();
        clearSession();
    },

    async getProfile() {
        const response = await httpClient.get(`/users/me`);
        return toAuthUserViewModel(response);
    },

    /**
     * Guarda los cambios del perfil y devuelve el usuario ya actualizado.
     *
     * El view model usa firstName / lastName en camelCase, pero el endpoint
     * espera los nombres de la API (first_name / last_name), asi que se
     * traducen aqui. El backend ignora lo que no este en su lista blanca.
     */
    async updateProfile(changes) {
        const response = await httpClient.patch(`${RESOURCE}/me`, {
            first_name: changes.firstName,
            last_name: changes.lastName,
            phone: changes.phone,
            username: changes.username,
        });

        return toAuthUserViewModel(response);
    },

    getStoredUser,

    forgotPassword: (email) =>
        httpClient.post(`${RESOURCE}/forgot-password`, { email }),

    verifyCode: (email, code) =>
        httpClient.post(`${RESOURCE}/verify-code`, { email, code }),

    resetPassword: (payload) =>
        httpClient.post(`${RESOURCE}/reset-password`, payload),

    changePassword: (currentPassword, newPassword) =>
        httpClient.patch(
            `${RESOURCE}/me/password`,
            { currentPassword, newPassword }
        ),
    async changeEmail(newEmail, currentPassword) {
        const response = await httpClient.patch(`${RESOURCE}/me/email`, {
            newEmail,
            currentPassword,
        });

        return toAuthUserViewModel(response);
    },
};
