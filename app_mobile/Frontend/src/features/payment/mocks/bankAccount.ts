import type { BankAccount } from "../../../types";

/**
 * Cuentas bancarias de la empresa.
 *
 * NO esta en la API mock, asi que se resuelve localmente. Los datos se
 * replican del frontend web (`web/Front-end/src/features/admin/bankAccounts/
 * services/BankAccountsMock.js`).
 *
 * Este catalogo **reemplaza** al concepto `PaymentMethod` (tarjetas): el
 * pago es una transferencia bancaria manual que un Admin revisa
 * (INV-004 en el dominio), asi que el cliente elige a que cuenta transfiere.
 *
 * INV-002: una cuenta inactiva se oculta en el checkout pero conserva su
 * historial de pagos. La 4a cuenta viene inactiva a proposito para probarlo.
 *
 * `qrImageUrl` se queda en `null` en todas, igual que en el web: el QR
 * bancario es de valor fijo y aqui el monto se calcula por reserva
 * (`calculateInvoiceTotal`), asi que no serviria de nada. El cliente
 * transfiere con el numero de cuenta, que es ademas lo que el Admin concilia.
 *
 * OJO: el texto se copio en su momento sin tildes ni rayas largas
 * ("S.A.S. -" en vez de "S.A.S. —", "Linea", "Bogota"). Este archivo es la
 * copia fiel del web.
 *
 * El `id` se normaliza a string, como el resto del dominio.
 */
export const bankAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "Bancolombia",
    accountType: "Cuenta de Ahorros",
    accountNumber: "459-002194-12",
    holderName: "RentaMovil S.A.S. — NIT 901.482.109-4",
    qrImageUrl: null,
    isActive: true,
  },
  {
    id: "2",
    bankName: "Nequi",
    accountType: "Línea QR Directa",
    accountNumber: "311 456 7890",
    holderName: "RentaMovil S.A.S. — NIT 901.482.109-4",
    qrImageUrl: null,
    isActive: true,
  },
  {
    id: "3",
    bankName: "Davivienda",
    accountType: "Cuenta Corriente",
    accountNumber: "008-992340-91",
    holderName: "RentaMovil S.A.S. — NIT 901.482.109-4",
    qrImageUrl: null,
    isActive: true,
  },
  {
    id: "4",
    bankName: "Banco de Bogotá",
    accountType: "Cuenta de Ahorros",
    accountNumber: "102-449102-05",
    holderName: "RentaMovil S.A.S. — NIT 901.482.109-4",
    qrImageUrl: null,
    isActive: false,
  },
];
