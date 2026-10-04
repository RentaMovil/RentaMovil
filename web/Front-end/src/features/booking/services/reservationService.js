import { httpClient } from "../../../shared/api/httpClient";
import {
    fromApiReservation,
    toCreateReservationPayload,
    toModifyReservationPayload,
} from "./reservationMapper";

// API de booking-reservation (a través del gateway).
//
// Las respuestas se normalizan con fromApiReservation a la forma que ya usan los
// view models (snake_case), así las páginas no dependen del formato del backend.
//
// El cliente nunca envía precios, estado ni su propio id: el servidor calcula los
// montos, la reserva nace en PENDING_PAYMENT y el titular sale del token.
export const reservationService = {
    // Reservas del usuario autenticado (HU-BOOKING-004)
    getMine: async () => (await httpClient.get("/reservations/mine")).map(fromApiReservation),

    getById: async (id) => fromApiReservation(await httpClient.get(`/reservations/${id}`)),

    // Panel de administración (HU-BOOKING-008). status opcional: PENDING_REVIEW, CONFIRMED...
    // "/reservations/admin" y no "/admin/reservations": el gateway no enruta /admin/**, solo
    // /reservations/**, /rentals/** y /notifications/**.
    getAllAdmin: async (status) => {
        const query = status ? `?status=${encodeURIComponent(status)}` : "";
        return (await httpClient.get(`/reservations/admin${query}`)).map(fromApiReservation);
    },

    create: async (reservation) =>
        fromApiReservation(await httpClient.post("/reservations", toCreateReservationPayload(reservation))),

    // Sin recargo, hasta 3 días antes de la fecha de recogida (INV-004)
    cancel: async (id) => fromApiReservation(await httpClient.post(`/reservations/${id}/cancel`)),

    // Lo único modificable de una reserva: su sucursal de devolución, hasta 3 días antes
    // de la fecha de devolución (INV-013). Las fechas no se pueden cambiar.
    updateReturnBranch: async (id, returnBranchId) =>
        fromApiReservation(await httpClient.patch(`/reservations/${id}`, toModifyReservationPayload(returnBranchId))),

    // No hay updateStatus: el estado de una reserva nunca se cambia a mano. Lo cambian
    // las reglas del backend (pago aprobado o rechazado, pickup, devolución, expiración).
};
