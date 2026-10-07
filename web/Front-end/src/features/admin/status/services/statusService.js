import { httpClient } from "../../../../shared/api/httpClient";
import { toUpdateStatusPayload } from './statusMapper'
import { fromApiVehicle, toApiVehicleWrite } from "../../../vehicles/Services/fleetVehicleMapper";

const RESOURCE = '/vehicles'

export const statusService = {
    getAll: async () => (await httpClient.get(`${RESOURCE}/inventory`)).map(fromApiVehicle),
    getById: async (id) => fromApiVehicle(await httpClient.get(`${RESOURCE}/${id}`)),

    // El formulario de estado edita datos del vehículo. Lo que no trae (modelo, sucursal) se toma
    // del vehículo actual; el estado solo puede pasar a retirado desde aquí.
    update: async (id, formData) => {
        const current = fromApiVehicle(await httpClient.get(`${RESOURCE}/${id}`));
        const edited = toUpdateStatusPayload(formData);

        if (edited.status === 'Retirado' && current.status !== 'Retirado') {
            return fromApiVehicle(await httpClient.patch(`${RESOURCE}/${id}/status`, { status: 'RETIRED' }));
        }

        const body = await toApiVehicleWrite({
            ...current,
            plate: edited.plate || current.plate,
            mileage: edited.mileage || current.mileage,
            year: edited.year || current.year,
            price: edited.price || current.price,
            capacity: edited.capacity || current.capacity,
            image: edited.image || current.image,
        });
        return fromApiVehicle(await httpClient.put(`${RESOURCE}/${id}`, body));
    },

    // fleet no borra vehículos: se retiran del catálogo
    remove: async (id) => fromApiVehicle(await httpClient.patch(`${RESOURCE}/${id}/status`, { status: 'RETIRED' })),
}
