import { carsService } from "../../../vehicles/Services/carsService";

// El inventario muestra la flota completa (todos los estados), no solo el catálogo
export const inventoryService = {
    getAll: () => carsService.getAllForAdmin(),
    getById: (id) => carsService.getById(id),
}
