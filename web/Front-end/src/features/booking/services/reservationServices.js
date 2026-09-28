import { reservationsMock } from "../data/mocks/reservationsMocks.js";
import { isValidTermsAcceptance } from "../data/rentalTerms";

export const getReservations = async () => {
    return Promise.resolve(reservationsMock);
};

export const cancelReservation = async (id) => {
    return Promise.resolve({
        success: true,
        id,
    });
};

/**
 * Actualiza la sucursal de devolución de una reserva.
 *
 * Regla de negocio real (src/types/reservation.ts — Reservation.returnBranchId,
 * INV-013): "Can only be changed up to 3 days before endDate". La UI
 * (HistoryReservationDetail.jsx) ya oculta la opción de editar cuando esa
 * ventana se cerró, pero el servicio también valida acá — así, cuando esto
 * se conecte a un backend real, el mismo chequeo que hará el servidor ya
 * está modelado del lado del cliente y no hay que inventarlo de nuevo.
 *
 * Simulación: cuando exista backend, esto pasa a ser
 * PATCH /api/reservations/:id/return-branch  body: { returnBranchId }
 * devolviendo la Reservation actualizada.
 */
export const updateReturnBranch = async (reservationId, returnBranchId) => {
    const reservation = reservationsMock.find((r) => r.id === reservationId);

    if (!reservation) {
        throw new Error("Reserva no encontrada.");
    }

    if (reservation.status !== "activa") {
        throw new Error(
            "Solo se puede modificar la sucursal de devolución de una reserva activa."
        );
    }

    const endDate = new Date(reservation.tiempos.end_date);
    const now = new Date();
    const daysUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilEnd <= 3) {
        throw new Error(
            "La sucursal de devolución solo puede modificarse hasta 3 días antes de la fecha de devolución (INV-013)."
        );
    }

    // Simulación: en el mock esto muta el registro en memoria para que
    // getReservations() lo siga viendo consistente durante la sesión;
    // el backend real simplemente persistiría el UPDATE.
    reservation.returnBranchId = returnBranchId;

    return Promise.resolve({
        success: true,
        reservationId,
        returnBranchId,
    });
};

export const createReservation = async (reservationRequest) => {
    // Esta validación simula la regla del servidor. El backend real debe
    // rechazar la creación de la reserva si falta o no coincide la aceptación.
    if (!isValidTermsAcceptance(reservationRequest?.termsAcceptance)) {
        throw new Error(
            "La reserva requiere la aceptación válida de los términos y condiciones."
        );
    }

    console.log(
        "Simulando guardado en el servidor...",
        reservationRequest
    );

    // Devuelve la Reservation "plana" (ver types/reservation.ts:
    // reservationId a nivel raíz de la entidad), tal como la consume
    // usePaymentForm.jsx (reservationResponse.reservationId). Antes iba
    // envuelto en { success, message, data: { reservationId, ... } } y
    // reservationResponse.reservationId siempre llegaba undefined, lo que
    // hacía fallar submitPayment con "No se recibió el ID de la reserva."
    // reservationRequest ya trae status: "PENDING_PAYMENT" (ver
    // buildReservationRequest.jsx); aquí solo se agregan los campos que
    // le corresponden al backend/simulación: reservationId y reservationDate.
    return Promise.resolve({
        reservationId: crypto.randomUUID(),
        reservationDate: new Date().toISOString(),
        ...reservationRequest,
    });
};
