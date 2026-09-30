import { isValidTermsAcceptance } from "../data/rentalTerms";

export function toCreateReservationPayload(reservation, vehicleSubtotal, insuranceSubtotal, totalAmount, clientId) {
    if (
        !reservation?.vehicle?.vehicleId ||
        !reservation?.pickupBranch?.id ||
        !reservation?.returnBranch?.id ||
        !reservation?.pickupDate ||
        !reservation?.returnDate ||
        !isValidTermsAcceptance(reservation?.termsAcceptance)
    ) {
        throw new Error("La reserva está incompleta");
    }

    return {
        client_id: clientId,
        vehicle_id: reservation.vehicle.vehicleId,
        insurance_type_id: reservation.insuranceId ?? null,
        pickup_branch_id: reservation.pickupBranch.id,
        return_branch_id: reservation.returnBranch.id,
        reservation_date: new Date().toISOString(),
        start_date: new Date(reservation.pickupDate).toISOString(),
        end_date: new Date(reservation.returnDate).toISOString(),
        vehicle_subtotal: vehicleSubtotal,
        insurance_subtotal: insuranceSubtotal,
        total_amount: totalAmount,
        status: 'PENDING_PAYMENT',
    };
}

export function toUpdateReturnBranchPayload(returnBranchId) {
    return { return_branch_id: returnBranchId };
}

export function toReservationViewModel(reservation, { vehiclesById = {}, branchesById = {}, insuranceById = {} } = {}) {
    const vehicle = vehiclesById[reservation.vehicle_id] || {};
    const days = Math.max(
        1,
        Math.round((new Date(reservation.end_date) - new Date(reservation.start_date)) / (1000 * 60 * 60 * 24))
    );
    const insurancePlan = insuranceById[reservation.insurance_type_id];

    return {
        id: reservation.id,
        status: (reservation.status || '').toLowerCase(),
        created_at: reservation.reservation_date,
        pickupBranchId: reservation.pickup_branch_id,
        returnBranchId: reservation.return_branch_id,
        vehicle: {
            img: vehicle.image,
            brand: vehicle.brand,
            model: vehicle.model,
            plate: vehicle.plate,
            category: vehicle.vehicleType,
            seats: vehicle.capacity,
        },
        tiempos: {
            start_date: reservation.start_date,
            end_date: reservation.end_date,
            days,
        },
        billing: {
            price_per_day: Number(vehicle.price) || 0,
            insurance_per_day: insurancePlan ? Number(insurancePlan.daily_cost) : 0,
            subtotal_vehicle: reservation.vehicle_subtotal,
            subtotal_insurance: reservation.insurance_subtotal,
            total_price: reservation.total_amount,
            insurance_included: Boolean(reservation.insurance_type_id),
        },
        currency: 'COP',
    };
}