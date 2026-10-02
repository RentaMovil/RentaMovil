import { httpClient } from "../../../shared/api/httpClient";
import { toUpdateProfilePayload } from "./countMapper";

// Perfil del usuario logueado en iam (GET y PATCH /users/me)
const RESOURCE = "/users/me";

export const countService = {
    getProfile: () => httpClient.get(RESOURCE),
    updateProfile: (formData) => httpClient.patch(RESOURCE, toUpdateProfilePayload(formData)),
    // iam todavía no tiene DELETE /users/me: esto responde 405 hasta que se agregue
    deleteAccount: () => httpClient.delete(RESOURCE),
};