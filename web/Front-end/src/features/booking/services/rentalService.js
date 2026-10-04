import { httpClient } from "../../../shared/api/httpClient";
import { fromApiRental, toCreatePickupPayload, toReturnPayload } from "./rentalMapper";

// Rentas de booking-reservation. Solo las usa el Administrador.
export const rentalService = {
    // "/rentals/in-progress" y no "/admin/rentals": el gateway no enruta /admin/**.
    getAll: async () => (await httpClient.get("/rentals/in-progress")).map(fromApiRental),

    // HU-RENTAL-001: la reserva debe estar CONFIRMED. El backend crea la renta en IN_PROGRESS.
    createPickup: async (reservationId, gpsId, mileage) =>
        fromApiRental(await httpClient.post(`/rentals/${reservationId}/pickup`, toCreatePickupPayload(gpsId, mileage))),

    // HU-RENTAL-002: el backend cierra la renta y pasa la reserva a COMPLETED.
    registerReturn: async (rentalId, finalMileage) =>
        fromApiRental(await httpClient.post(`/rentals/${rentalId}/return`, toReturnPayload(finalMileage))),
};
