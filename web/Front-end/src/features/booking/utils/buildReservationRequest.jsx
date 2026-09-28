import {
    isValidTermsAcceptance,
} from "../data/rentalTerms";

export function buildReservationRequest(
    reservation,
    vehicleSubtotal,
    insuranceSubtotal,
    totalAmount
) {
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
        vehicleId: reservation.vehicle.vehicleId,
        pickupBranchId: reservation.pickupBranch.id,
        returnBranchId: reservation.returnBranch.id,
        insuranceId: reservation.insuranceId ?? null,

        startDate: new Date(reservation.pickupDate).toISOString(),
        endDate: new Date(reservation.returnDate).toISOString(),

        termsAcceptance: {
            ...reservation.termsAcceptance,
        },

        vehicleSubtotal,
        insuranceSubtotal,
        totalAmount,

        status: "PENDING_PAYMENT",
    };
}