import { httpClient } from '../../../../shared/api/httpClient';

/**
 * Servicio de telemetria GPS (EP-006 / HU-GPS-001).
 */
const RESOURCE = '/gps';

export const locationService = {
    /** Vehiculos con rental IN_PROGRESS y su ultima posicion registrada. */
    getTrackedVehicles: () => httpClient.get(`${RESOURCE}/vehicles`),

    /** Un vehiculo concreto. Lanza si no tiene rental en curso ni posicion. */
    getTrackedVehicle: (vehicleId) => httpClient.get(`${RESOURCE}/vehicles/${vehicleId}`),


    getTrack: (vehicleId) => httpClient.get(`${RESOURCE}/vehicles/${vehicleId}/track`),
};
