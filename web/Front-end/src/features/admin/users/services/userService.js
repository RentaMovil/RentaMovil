import { httpClient } from "../../../../shared/api/httpClient";
import { toUpdateRolePayload } from "./userMapper";

const RESOURCE = "/users";

export const userService = {
    getAll: () => httpClient.get(RESOURCE),
    updateRole: (id, role) => httpClient.patch(`${RESOURCE}/${id}/role`, toUpdateRolePayload(role)),
};