import { httpClient } from "../../../shared/api/httpClient";
import { toUpdateProfilePayload } from "./countMapper";

// El perfil vive en /users/me (ProfileController de iam), no bajo /auth/me.
const RESOURCE = "/users/me";

export const countService = {
    getProfile: () => httpClient.get(RESOURCE),
    updateProfile: (formData) => httpClient.patch(RESOURCE, toUpdateProfilePayload(formData)),
    deleteAccount: () => httpClient.delete(RESOURCE),
};