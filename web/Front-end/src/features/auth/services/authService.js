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
// El perfil vive en /users/me (ProfileController), no bajo /auth: el gateway le quita el
// prefijo a /auth/** y iam no expone un /me suelto.
const USERS_RESOURCE = "/users";

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
        const response = await httpClient.get(`${USERS_RESOURCE}/me`);
        return toAuthUserViewModel(response);
    },

    /**
     * Guarda los cambios del perfil y devuelve el usuario ya actualizado.
     *
     * El backend espera camelCase (UpdateProfileRequest en rtm-iam), no snake_case.
     */
    async updateProfile(changes) {
        const response = await httpClient.patch(`${USERS_RESOURCE}/me`, {
            firstName: changes.firstName,
            lastName: changes.lastName,
            phone: changes.phone,
        });

        return toAuthUserViewModel(response);
    },

    getStoredUser,

    forgotPassword: (email) =>
        httpClient.post(`${RESOURCE}/password/forgot`, { email }),

    resetPassword: (payload) =>
        httpClient.post(`${RESOURCE}/password/reset`, payload),

    changePassword: (currentPassword, newPassword) =>
        httpClient.patch(
            `${USERS_RESOURCE}/me/password`,
            { currentPassword, newPassword }
        ),
    async changeEmail(newEmail, currentPassword) {
        const response = await httpClient.patch(`${USERS_RESOURCE}/me/email`, {
            newEmail,
            currentPassword,
        });

        return toAuthUserViewModel(response);
    },
};
