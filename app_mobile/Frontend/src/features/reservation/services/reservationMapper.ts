import type {
    InsuranceType,
    Reservation,
    ReservationRequest,
    ReservationResponse,
    Vehicle,
} from "../../../types";
import { RESERVATION_STATUS } from "../../../types";

function toApiId(id: string): string | number {
    const numericId = Number(id);
    return Number.isFinite(numericId) ? numericId : id;
}

export function toCreateReservationPayload(
    request: ReservationRequest,
    clientId: string,
    vehicle: Vehicle,
    insurance?: InsuranceType,
) {
    const days = Math.max(
        1,
        Math.ceil(
            (new Date(request.returnDate).getTime() - new Date(request.pickupDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
    );
    const vehicleSubtotal = days * vehicle.price;
    const insuranceSubtotal = days * (insurance?.price ?? 0);

    return {
        client_id: toApiId(clientId),
        vehicle_id: toApiId(request.vehicleId),
        insurance_type_id: request.insuranceTypeId ? toApiId(request.insuranceTypeId) : null,
        pickup_branch_id: toApiId(request.pickupBranchId),
        return_branch_id: toApiId(request.returnBranchId),
        reservation_date: new Date().toISOString(),
        start_date: request.pickupDate,
        end_date: request.returnDate,
        days,
        price_per_day: vehicle.price,
        vehicle_subtotal: vehicleSubtotal,
        insurance_per_day: insurance?.price ?? 0,
        insurance_subtotal: insuranceSubtotal,
        total_amount: vehicleSubtotal + insuranceSubtotal,
        status: RESERVATION_STATUS.PENDING_PAYMENT,
    };
}

export function toReservationResponse(raw: any): ReservationResponse {
    return {
        reservationId: String(raw.id),
        status: raw.status,
    };
}

export function toReservationViewModel(raw: any): Reservation {
    const startDate = raw.start_date ?? raw.startDate;
    const endDate = raw.end_date ?? raw.endDate;
    const days = Math.max(
        1,
        Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
    );
    const vehicleSubtotal = raw.vehicle_subtotal ?? raw.subtotal_vehicle ?? 0;
    const insuranceSubtotal = raw.insurance_subtotal ?? raw.subtotal_insurance ?? 0;

    return {
        id: String(raw.id),
        created_at: raw.created_at ?? raw.reservation_date ?? "",
        status: raw.status ?? RESERVATION_STATUS.PENDING_PAYMENT,
        currency: raw.currency ?? "COP",
        clientId: String(raw.client_id ?? raw.clientId ?? ""),
        vehicleId: String(raw.vehicle_id ?? raw.vehicleId ?? ""),
        ...(raw.insurance_type_id || raw.insuranceTypeId
            ? { insuranceTypeId: String(raw.insurance_type_id ?? raw.insuranceTypeId) }
            : {}),
        pickupBranchId: String(raw.pickup_branch_id ?? raw.pickupBranchId ?? ""),
        returnBranchId: String(raw.return_branch_id ?? raw.returnBranchId ?? ""),
        start_date: startDate,
        end_date: endDate,
        days: raw.days ?? days,
        price_per_day: raw.price_per_day ?? raw.pricePerDay ?? (vehicleSubtotal / days),
        subtotal_vehicle: vehicleSubtotal,
        insurance_per_day: raw.insurance_per_day ?? raw.insurancePerDay ?? (insuranceSubtotal / days),
        subtotal_insurance: insuranceSubtotal,
        total_price: raw.total_amount ?? raw.total_price ?? (vehicleSubtotal + insuranceSubtotal),
        insurance_included: raw.insurance_included ?? Boolean(raw.insurance_type_id ?? raw.insuranceTypeId),
    } as Reservation;
}