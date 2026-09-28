import {
    Reservation,
    ReservationResponse,
    ReservationRequest,
    RESERVATION_STATUS,
} from "../../../types";

import {
    reservationsMock,
} from "../mocks/reservationMock";


/**
 * Crea la reserva.
 *
 * La reserva es un agregado propio: nace ANTES que el pago y en estado
 * PENDING_PAYMENT (ver `ReservationStatus` en el dominio del web). El pago es
 * otro agregado, con su propio ciclo (PENDING_REVIEW -> el Admin aprueba ->
 * la reserva pasa a CONFIRMED). Por eso esta funcion no recibe ni exige metodo
 * de pago, y por eso la pantalla de reserva no debe esperar a que se elija uno.
 */
export async function createReservation(
    data: ReservationRequest
): Promise<ReservationResponse> {

    console.log(
        "Creando reserva:",
        data
    );

    // Futuro:
    // return api.post(
    //     "/reservations",
    //     data
    // );

    return {

        reservationId:
            "mock-reservation-123",

        status:
            RESERVATION_STATUS.PENDING_PAYMENT,

    };

}


export async function getMyReservations():
    Promise<Reservation[]> {

    return reservationsMock;

}


export async function getReservationById(
    id: string
): Promise<Reservation | undefined> {

    console.log(
        "Buscando reserva:",
        id
    );

    // Futuro:
    // return api.get(
    //     `/reservations/${id}`
    // );

    return reservationsMock.find(
        reservation =>
            reservation.id === id
    );

}


export async function cancelReservation(
    id: string
): Promise<Reservation | undefined> {

    console.log(
        "Cancelando reserva:",
        id
    );

    // Futuro:
    // return api.patch(
    //     `/reservations/${id}/cancel`
    // );

    const reservation =
        reservationsMock.find(
            reservation =>
                reservation.id === id
        );

    if (!reservation) {

        return undefined;

    }

    reservation.status =
        RESERVATION_STATUS.CANCELLED;

    return reservation;

}