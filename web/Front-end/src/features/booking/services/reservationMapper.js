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

export function toAdminReservationViewModel(reservation, ctx) {
    const { vehiclesById = {}, branchesById = {}, insuranceById = {}, usersById = {}, paymentsByReservation = {}, rentalsByReservation = {}, bankAccountsById = {}, gpsById = {} } = ctx;

    const vehicle = vehiclesById[reservation.vehicle_id] || {};
    const customer = usersById[reservation.client_id] || {};
    const pickupBranch = branchesById[reservation.pickup_branch_id] || {};
    const dropoffBranch = branchesById[reservation.return_branch_id] || {};
    const insurancePlan = insuranceById[reservation.insurance_type_id];
    const payment = paymentsByReservation[reservation.id];
    const rental = rentalsByReservation[reservation.id];
    const bankAccount = payment ? bankAccountsById[payment.bank_account_id] : null;
    const gps = rental ? gpsById[rental.gps_id] : null;

    const durationDays = Math.max(
        1,
        Math.round((new Date(reservation.end_date) - new Date(reservation.start_date)) / (1000 * 60 * 60 * 24))
    );

    return {
        id: reservation.id,
        status: reservation.status,
        rentalSubtotal: reservation.vehicle_subtotal,
        durationDays,
        vehicle: {
            name: [vehicle.brand, vehicle.model].filter(Boolean).join(' '),
            plate: vehicle.plate,
            category: vehicle.vehicleType,
            fuel: vehicle.fuelType,
            seats: vehicle.capacity,
            mileage: vehicle.mileage || 0,
        },
        customer: {
            name: [customer.first_name, customer.last_name].filter(Boolean).join(' '),
            email: customer.email,
            phone: customer.phone,
        },
        pickup: {
            date: reservation.start_date,
            branchName: pickupBranch.name,
            branchAddress: pickupBranch.address,
        },
        dropoff: {
            date: reservation.end_date,
            branchName: dropoffBranch.name,
            branchAddress: dropoffBranch.address,
        },
        insurance: {
            name: insurancePlan?.name || 'Sin seguro',
            amount: reservation.insurance_subtotal,
        },
        payment: payment ? {
            id: payment.id,
            amount: payment.amount,
            bank: bankAccount?.bank_name,
            reference: payment.reference_number,
            receivedAt: payment.payment_date,
            receiptImageUrl: payment.receipt_file_url,
            uploadedBy: customer.username,
            rejectionReason: payment.rejection_reason,
            reviewedBy: payment.reviewed_by,
            reviewedAt: payment.reviewed_at,
        } : null,
        rental: rental ? {
            id: rental.id,
            status: rental.status,
            pickupMileage: rental.initial_mileage,
            pickupAt: rental.actual_start_date,
            returnMileage: rental.final_mileage,
            returnAt: rental.actual_end_date,
            gpsDevice: gps?.serial || null,
        } : null,
    };
}