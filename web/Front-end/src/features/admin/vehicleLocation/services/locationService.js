import { httpClient } from '../../../../shared/api/httpClient';
import { toLocationViewModel } from "./locationMapper";
import { rentalService } from "../../../booking/services/rentalService";
import { reservationService } from "../../../booking/services/reservationService";
import { inventoryService } from "../../VehicleInventory/services/inventoryService";

export const locationService = {
    // Vehículos con rental IN_PROGRESS + su última posición conocida.
    // No existe un endpoint compuesto en el modelo, así que se arma
    // cruzando 4 colecciones — mismo patrón que useReservationsAdmin.
    getTrackedVehicles: async () => {
        const [rentals, gpsDevices, locations, reservations, vehicles] = await Promise.all([
            rentalService.getAll(),
            // /gps y /locations son de telemetry-gps, que todavía no existe
            httpClient.get('/gps'),
            httpClient.get('/locations'),
            reservationService.getAllAdmin(),
            inventoryService.getAll(),
        ]);

        const gpsById = Object.fromEntries(gpsDevices.map((g) => [g.id, g]));
        const reservationsById = Object.fromEntries(reservations.map((r) => [r.id, r]));
        const vehiclesById = Object.fromEntries(vehicles.map((v) => [v.id, v]));

        const activeRentals = rentals.filter((r) => r.status === 'IN_PROGRESS' && r.gps_id);

        return activeRentals.map((rental) => {
            const reservation = reservationsById[rental.reservation_id];
            const vehicle = reservation ? vehiclesById[reservation.vehicle_id] : null;

            const lastLocation = locations
                .filter((loc) => loc.gps_id === rental.gps_id)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

            return {
                vehicle_id: vehicle?.id,
                plate: vehicle?.plate,
                brand: vehicle?.brand,
                model: vehicle?.model,
                rental: { id: rental.id },
                device: gpsById[rental.gps_id] ? {
                    model: gpsById[rental.gps_id].model,
                    connected: gpsById[rental.gps_id].is_active,
                } : null,
                position: lastLocation ? toLocationViewModel(lastLocation) : null,
            };
        });
    },

    getTrack: (vehicleId) => httpClient.get(`/vehicles/${vehicleId}/track`), //  no existe todavía, pendiente
};