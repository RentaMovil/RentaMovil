import { httpClient } from '../../../../shared/api/httpClient';
import { toVehiclePayload } from './vehicleMapper';
import { fromApiVehicle, toApiVehicleWrite } from '../../../vehicles/Services/fleetVehicleMapper';

const RESOURCE = '/vehicles';

export const vehicleService = {
    getAll: async () => (await httpClient.get(`${RESOURCE}/inventory`)).map(fromApiVehicle),
    getById: async (id) => fromApiVehicle(await httpClient.get(`${RESOURCE}/${id}`)),
    create: async (vehicleData) =>
        fromApiVehicle(await httpClient.post(RESOURCE, await toApiVehicleWrite(toVehiclePayload(vehicleData)))),
    update: async (id, vehicleData) =>
        fromApiVehicle(await httpClient.put(`${RESOURCE}/${id}`, await toApiVehicleWrite(toVehiclePayload(vehicleData)))),

    // fleet solo acepta pasar a mantenimiento (con su tipo, ver maintenanceService) o a retirado;
    // a disponible se vuelve cerrando el mantenimiento
    updateStatus: async (id, status) => {
        if (status !== 'Retirado') {
            throw new Error('Ese cambio de estado se hace desde Mantenimiento');
        }
        return fromApiVehicle(await httpClient.patch(`${RESOURCE}/${id}/status`, { status: 'RETIRED' }));
    },

    // fleet no borra vehículos (tienen reservas e historial): se retiran del catálogo
    remove: (id) => vehicleService.updateStatus(id, 'Retirado'),
};
