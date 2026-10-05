import { httpClient } from '../../../../shared/api/httpClient';
import { carsService } from '../../../vehicles/Services/carsService';
import { fromFleetVehicle, toFleetVehiclePayload } from '../../../vehicles/Services/fleetVehicleAdapter';
const RESOURCE = '/vehicles';

// Administración de vehículos en fleet-maintenance (HU-FLEET-004, 005, 006).
// No hay eliminar: un vehículo se retira (status RETIRED), nunca se borra del sistema.
export const vehicleService = {
    // Todos los estados (requiere sesión de administrador)
    getAll: () => carsService.getAllForAdmin(),
    getById: (id) => carsService.getById(id),
    create: async (vehicleData) => fromFleetVehicle(await httpClient.post(RESOURCE, toFleetVehiclePayload(vehicleData))),
    // Reemplazo completo; el estado no se toca aquí
    update: async (id, vehicleData) => fromFleetVehicle(await httpClient.put(`${RESOURCE}/${id}`, toFleetVehiclePayload(vehicleData))),
    // Solo MAINTENANCE (con maintenanceTypeId) o RETIRED: AVAILABLE nunca es un destino manual
    updateStatus: async (id, status, maintenanceTypeId) =>
        fromFleetVehicle(await httpClient.patch(`${RESOURCE}/${id}/status`, { status, maintenanceTypeId })),
    retire: (id) => vehicleService.updateStatus(id, 'RETIRED'),
};
