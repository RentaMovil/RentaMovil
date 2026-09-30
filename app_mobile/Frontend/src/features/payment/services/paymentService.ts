import { bankAccounts } from "../mocks/bankAccount";

import type { BankAccount, Payment, PaymentDraft } from "../../../types";

/**
 * Servicio de pagos.
 *
 * El pago es una **transferencia bancaria manual revisada por un Admin**
 * (INV-004 en el dominio del web): no hay pasarela automatica, asi que aqui
 * no existen tarjetas, ni pasarela, ni `transactionId` de gateway. El
 * cliente elige una cuenta de destino, sube el comprobante y el Admin lo
 * aprueba o rechaza.
 *
 * NO esta en la API mock: los endpoints de pago todavia no estan
 * determinados, asi que se resuelve localmente. El contrato de entrada y
 * salida es el mismo que tendra la llamada real, de modo que conectarla
 * sea solo sustituir el cuerpo de estas funciones.
 */

/**
 * Cuentas activas para el checkout.
 *
 * INV-002: las inactivas se ocultan al cliente, no se eliminan.
 */
export async function getActiveBankAccounts(): Promise<BankAccount[]> {
  // Futuro:
  // return supabase
  //   .from("bank_accounts")
  //   .select("*")
  //   .eq("is_active", true);

  return bankAccounts.filter((account) => account.isActive);
}

/**
 * Registra el pago de una reserva.
 *
 * Valida lo que el dominio da por hecho: sin `reservationId` no hay a que
 * pago se asignar, sin `bankAccountId` no se sabe a donde se transfirio, y
 * sin comprobante un Admin no tiene nada que revisar.
 *
 * El estado es SIEMPRE `PENDING_REVIEW`: el cliente no aprueba su propio
 * pago. Cuando exista backend, el Admin pasara a APPROVED o REJECTED.
 */
export async function createPayment(
  draft: PaymentDraft,
): Promise<Payment> {
  if (!draft.reservationId) {
    throw new Error("Falta el ID de la reserva para registrar el pago.");
  }

  if (!draft.bankAccountId) {
    throw new Error("Falta la cuenta bancaria destino del pago.");
  }

  if (!draft.receiptFile) {
    throw new Error("Falta el comprobante de pago.");
  }

  console.log("Registrando pago:", draft);

  // Futuro:
  // 1. POST multipart/form-data con el comprobante -> storage (S3/MinIO)
  //    y se guarda la URL devuelta.
  // 2. POST /payments con { reservationId, bankAccountId, amount,
  //    referenceNumber, receiptFileUrl }

  return {
    paymentId: "mock-payment-123",
    reservationId: draft.reservationId,
    bankAccountId: draft.bankAccountId,
    paymentDate: new Date().toISOString(),
    amount: draft.amount,
    ...(draft.referenceNumber
      ? { referenceNumber: draft.referenceNumber }
      : {}),
    receiptFileUrl: draft.receiptFile,
    status: "PENDING_REVIEW",
  };
}
