import { httpClient } from "../../../shared/api/httpClient";
import { fromApiVehicle, fromApiVehiclePage } from "./fleetVehicleMapper";

const RESOURCE = '/vehicles'

// Catálogo público de fleet: solo vehículos AVAILABLE. Se pide la página máxima (100) porque
// la búsqueda y los filtros de la home se hacen en el navegador.
export const carsService = {
    getAll: async () => fromApiVehiclePage(await httpClient.get(`${RESOURCE}?limit=100`)),
    getById: async (id) => fromApiVehicle(await httpClient.get(`${RESOURCE}/${id}`)),
}
