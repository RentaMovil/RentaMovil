import { httpClient } from "../../../../shared/api/httpClient";
import { fromApiVehicle } from "../../../vehicles/Services/fleetVehicleMapper";

// Inventario de administración: todos los vehículos, en cualquier estado
export const inventoryService = {
    getAll: async () => (await httpClient.get("/vehicles/inventory")).map(fromApiVehicle),
    getById: async (id) => fromApiVehicle(await httpClient.get(`/vehicles/${id}`)),
}
