export function toCreatePickupPayload(reservationId, gpsId, mileage) {
    return {
        reservation_id: reservationId,
        gps_id: gpsId,
        actual_start_date: new Date().toISOString(),
        initial_mileage: mileage,
        status: 'IN_PROGRESS',
    };
}

export function toReturnPayload(finalMileage) {
    return {
        actual_end_date: new Date().toISOString(),
        final_mileage: finalMileage,
        status: 'COMPLETED',
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