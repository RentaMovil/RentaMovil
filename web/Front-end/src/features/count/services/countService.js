import { httpClient } from "../../../shared/api/httpClient";
import { toUpdateProfilePayload } from "./countMapper";

const RESOURCE = "/auth/me";

export const countService = {
    getProfile: () => httpClient.get(RESOURCE),
    updateProfile: (formData) => httpClient.patch(RESOURCE, toUpdateProfilePayload(formData)),
    deleteAccount: () => httpClient.delete(RESOURCE),
};