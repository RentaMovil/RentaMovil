import { httpClient } from "../../../../shared/api/httpClient";
import { toCreateBranchPayload, toUpdateBranchPayload } from "./branchMapper";
const RESOURCE = "/branches"

export const branchService = {
    getAll: () => httpClient.get(RESOURCE),
    getById: (id) => httpClient.get(`${RESOURCE}/${id}`),
    create: (formData) => httpClient.post(RESOURCE, toCreateBranchPayload(formData)),
    // fleet edita la sucursal completa (PUT), no por partes
    update: (id, formData) => httpClient.put(`${RESOURCE}/${id}`, toUpdateBranchPayload(formData)),
    remove: (id) => httpClient.delete(`${RESOURCE}/${id}`),
};