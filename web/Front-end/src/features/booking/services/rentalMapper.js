import { fromApiDateTime } from "../../../shared/utils/apiDate";

// Respuesta de booking (camelCase) -> forma que usan los view models (snake_case)
export function fromApiRental(rental) {
    return {
        id: rental.id,
        reservation_id: rental.reservationId,
        gps_id: rental.gpsId,
        actual_start_date: fromApiDateTime(rental.actualStartDate),
        actual_end_date: fromApiDateTime(rental.actualEndDate),
        initial_mileage: rental.initialMileage == null ? null : Number(rental.initialMileage),
        final_mileage: rental.finalMileage == null ? null : Number(rental.finalMileage),
        status: rental.status,
    };
}

// La fecha real del pickup y el estado los pone el servidor
export function toCreatePickupPayload(gpsId, mileage) {
    return {
        gpsId: Number(gpsId),
        initialMileage: Number(mileage),
    };
}

// La fecha real de devolución y el estado COMPLETED los pone el servidor
export function toReturnPayload(finalMileage) {
    return {
        finalMileage: Number(finalMileage),
    };
}

export function toRentalViewModel(rental) {
    return {
        id: rental.id,
        reservationId: rental.reservation_id,
        gpsId: rental.gps_id,
        status: rental.status,
        pickupMileage: rental.initial_mileage,
        pickupAt: rental.actual_start_date,
        returnMileage: rental.final_mileage,
        returnAt: rental.actual_end_date,
    };
}
