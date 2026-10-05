import { httpClient } from "../../../../shared/api/httpClient";
import { toBranchPayload } from "./branchMapper";
const RESOURCE = "/branches"

// Sucursales en fleet-maintenance (HU-FLEET-007). Listar es público; crear, editar y eliminar
// requieren branches:manage. Eliminar responde 409 si la sucursal tiene vehículos asignados.
export const branchService = {
    getAll: () => httpClient.get(RESOURCE),
    create: (formData) => httpClient.post(RESOURCE, toBranchPayload(formData)),
    // fleet reemplaza la sucursal completa (PUT), con sus 7 días de horario
    update: (id, formData) => httpClient.put(`${RESOURCE}/${id}`, toBranchPayload(formData)),
    remove: (id) => httpClient.delete(`${RESOURCE}/${id}`),
};
