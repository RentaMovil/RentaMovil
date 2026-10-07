import { httpClient } from "../../../shared/api/httpClient";
import { fromFleetVehicle } from "./fleetVehicleAdapter";

const RESOURCE = '/vehicles';
// Máximo que acepta fleet por página
const PAGE_SIZE = 100;

// fleet pagina las respuestas ({ items, totalPages... }); aquí se traen todas las páginas
async function getAllPages(query) {
    const vehicles = [];
    let page = 1;
    let totalPages = 1;
    do {
        const response = await httpClient.get(`${RESOURCE}?${query}&page=${page}&limit=${PAGE_SIZE}`);
        vehicles.push(...response.items);
        totalPages = response.totalPages;
        page += 1;
    } while (page <= totalPages);
    return vehicles.map(fromFleetVehicle);
}

export const carsService = {
    // Catálogo público: solo vehículos AVAILABLE, sin sesión (HU-FLEET-001)
    getAll: () => getAllPages('status=AVAILABLE'),
    // Listado de administración: todos los estados. Requiere sesión con vehicles:update
    getAllForAdmin: () => getAllPages('status=ALL'),
    // Detalle público de un vehículo, en cualquier estado
    getById: async (id) => fromFleetVehicle(await httpClient.get(`${RESOURCE}/${id}`)),
    // fleet-maintenance: GET /vehicles/{id}/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
    getAvailability: async (id, from, to) =>
        httpClient.get(`${RESOURCE}/${id}/availability?from=${from}&to=${to}`),
}
