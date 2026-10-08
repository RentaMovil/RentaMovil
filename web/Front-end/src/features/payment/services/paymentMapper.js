export function toCreatePaymentPayload(paymentData, receiptFileUrl) {
    return {
        reservationId: paymentData.reservationId,
        bankAccountId: paymentData.bankAccountId,
        amount: paymentData.amount,
        referenceNumber: paymentData.referenceNumber,
        receiptFileUrl: receiptFileUrl,
    };
}

export function toPaymentViewModel(payment) {
    return {
        id: payment.id,
        reservationId: payment.reservationId,
        bankAccountId: payment.bankAccountId,
        amount: payment.amount,
        referenceNumber: payment.referenceNumber,
        receiptFileUrl: payment.receiptFileUrl,
        status: payment.status,
        reviewedBy: payment.reviewedBy,
        reviewedAt: payment.reviewedAt,
        rejectionReason: payment.rejectionReason,
    };
}

// outcome que espera PATCH /payments/{id}/reject (RejectOutcome del backend)
export function toRejectOutcome(rejectAction) {
    return rejectAction === "cancel" ? "RESERVATION_CANCELLED" : "RETRY_ALLOWED";
}
