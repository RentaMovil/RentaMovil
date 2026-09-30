export function toCreatePaymentPayload(paymentData, receiptFileUrl) {
    return {
        reservation_id: paymentData.reservationId,
        bank_account_id: paymentData.bankAccountId,
        payment_date: new Date().toISOString(),
        amount: paymentData.amount,
        reference_number: paymentData.referenceNumber,
        receipt_file_url: receiptFileUrl,
        status: 'PENDING_REVIEW',
    };
}

export function toPaymentViewModel(payment) {
    return {
        id: payment.id,
        reservationId: payment.reservation_id,
        bankAccountId: payment.bank_account_id,
        amount: payment.amount,
        referenceNumber: payment.reference_number,
        receiptFileUrl: payment.receipt_file_url,
        status: payment.status,
        reviewedBy: payment.reviewed_by,
        reviewedAt: payment.reviewed_at,
        rejectionReason: payment.rejection_reason,
    };
}