import type { Payment } from "../../../types";

function toApiId(id: string): string | number {
    const numericId = Number(id);
    return Number.isFinite(numericId) ? numericId : id;
}

export function toCreatePaymentPayload(draft: { reservationId: string; bankAccountId: string; amount: number; referenceNumber?: string; receiptFileUrl: string }) {
    return {
        reservation_id: toApiId(draft.reservationId),
        bank_account_id: toApiId(draft.bankAccountId),
        payment_date: new Date().toISOString(),
        amount: draft.amount,
        reference_number: draft.referenceNumber ?? null,
        receipt_file_url: draft.receiptFileUrl,
        status: "PENDING_REVIEW",
    };
}

export function toPaymentViewModel(raw: any): Payment {
    return {
        paymentId: String(raw.id),
        reservationId: String(raw.reservation_id),
        bankAccountId: String(raw.bank_account_id),
        paymentDate: raw.payment_date,
        amount: raw.amount,
        referenceNumber: raw.reference_number ?? undefined,
        receiptFileUrl: raw.receipt_file_url,
        status: raw.status,
    };
}