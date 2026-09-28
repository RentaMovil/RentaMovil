/**
 * Entity: BankAccount.
 *
 * NO esta en la API mock (mock local en la app). Se replica del frontend
 * web: `web/Front-end/src/features/admin/bankAccounts/services/BankAccountsMock.js`.
 *
 * Reemplaza al antiguo concepto `PaymentMethod` (tarjetas): el pago es una
 * transferencia bancaria manual revisada por un Admin, no una pasarela
 * automatica (INV-004 en el dominio del web).
 */
export type BankAccount = {
  id: string;
  /** "Bancolombia", "Nequi", "Davivienda" */
  bankName: string;
  accountType: string;
  accountNumber: string;
  /** Razon social de la empresa. */
  holderName: string;
  /** QR a mostrar en el checkout. `null` cuando no hay imagen. */
  qrImageUrl: string | null;
  /** Las cuentas inactivas se ocultan en el checkout (INV-002). */
  isActive: boolean;
};

/** Cuenta banksia mostrable en el checkout. */
export type BankAccountOption = {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  holderName: string;
  qrImageUrl: string | null;
};
