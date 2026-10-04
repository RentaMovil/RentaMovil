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

    // PATCH /users/me (iam): solo cambia nombre, apellido, teléfono y foto.
    // El username no se puede cambiar y el email va por /users/me/email.
    // Solo viajan los campos que vengan en `changes` (los undefined no se mandan).
    async updateProfile(changes) {
        const response = await httpClient.patch("/users/me", {
            firstName: changes.firstName,
            lastName: changes.lastName,
            phone: changes.phone,
            imageUrl: changes.imageUrl,
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
        const response = await httpClient.patch("/users/me/email", {
            newEmail,
            currentPassword,
        });

        return toAuthUserViewModel(response);
    },
};
