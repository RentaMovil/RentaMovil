import { filterAvailableByBranch } from "./vehiclesFilters.js";
import { carsService } from "../Services/carsService.js";

// Filtra por sucursal/estado y, si hay rango de fechas, verifica contra el backend
// que el vehículo no tenga otra reserva que se solape en esas fechas.
// Si el chequeo falla para un vehículo puntual, no lo escondemos: el backend
// vuelve a validar al crear la reserva (409) y es quien decide.
export async function filterAvailableVehicles(cars, branch, startDate, endDate) {
    const base = filterAvailableByBranch(cars, branch);

    if (!startDate || !endDate) {
        return base;
    }

    const checked = await Promise.all(
        base.map(async (car) => {
            try {
                const res = await carsService.getAvailability(car.id, startDate, endDate);
                return res?.available === false ? null : car;
            } catch {
                return car;
            }
        })
    );

    return checked.filter(Boolean);
}
