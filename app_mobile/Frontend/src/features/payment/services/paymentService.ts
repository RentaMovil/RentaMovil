import { httpClient } from "../../../shared/api/httpClient";
import { uploadPaymentReceipt } from "./paymentReceiptService";
import type { BankAccount, Payment, PaymentDraft } from "../../../types";
import { toBankAccountViewModel } from "./banckAccountMapper";
import { toCreatePaymentPayload, toPaymentViewModel } from "./paymentMapper";

export async function getActiveBankAccounts(): Promise<BankAccount[]> {
    const raw = await httpClient.get<any[]>("/bankAccounts");
    return raw.filter((account) => account.is_active).map(toBankAccountViewModel);
}

export async function createPayment(draft: PaymentDraft): Promise<Payment> {
    if (!draft.reservationId) {
        throw new Error("Falta el ID de la reserva para registrar el pago.");
    }
    if (!draft.bankAccountId) {
        throw new Error("Falta la cuenta bancaria destino del pago.");
    }
    if (!draft.receiptFile) {
        throw new Error("Falta el comprobante de pago.");
    }

    const receiptFileUrl = await uploadPaymentReceipt(draft.receiptFile);

    const raw = await httpClient.post<any>("/payments", toCreatePaymentPayload({
        reservationId: draft.reservationId,
        bankAccountId: draft.bankAccountId,
        amount: draft.amount,
        referenceNumber: draft.referenceNumber,
        receiptFileUrl,
    }));

    // El pago PENDING_REVIEW también mueve la reserva a PENDING_REVIEW
    // (mismo pendiente que quedó marcado del lado web — ver nota abajo)
    await httpClient.patch(`/reservations/${draft.reservationId}`, { status: "PENDING_REVIEW" });

    return toPaymentViewModel(raw);
}