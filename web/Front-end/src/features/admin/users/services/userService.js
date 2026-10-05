import { httpClient } from "../../../../shared/api/httpClient";
import { toUpdateRolePayload, toUpdateStatusPayload } from "./userMapper";

// Administración de usuarios en iam (solo SUPER_ADMIN)
const RESOURCE = "/users";

export const userService = {
    getAll: () => httpClient.get(RESOURCE),
    updateRole: (id, role) => httpClient.patch(`${RESOURCE}/${id}/role`, toUpdateRolePayload(role)),
    updateStatus: (id, status) => httpClient.patch(`${RESOURCE}/${id}/status`, toUpdateStatusPayload(status)),
};
