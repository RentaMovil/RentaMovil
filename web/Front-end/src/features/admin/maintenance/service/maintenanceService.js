import { httpClient } from '../../../../shared/api/httpClient';
import { toCreateMaintenancePayload, toUpdateMaintenancePayload } from './maintenanceMapper';
const RESOURCE = '/maintenances';

export const maintenanceService = {
    getAll: () => httpClient.get(RESOURCE),
    create: (formData) => httpClient.post(RESOURCE, toCreateMaintenancePayload(formData)),
    update: (id, formData) => httpClient.patch(`${RESOURCE}/${id}`, toUpdateMaintenancePayload(formData)),
    // Iniciar, completar o cancelar; el backend valida la transición y cambia el estado del vehículo
    changeStatus: (id, status) => httpClient.patch(`${RESOURCE}/${id}/status`, { status }),
};
