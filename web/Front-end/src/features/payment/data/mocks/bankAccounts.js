// Mock temporal de BankAccount (02-domain/entities-and-rules.md, contexto Payment & Billing).
// Reemplazar por la llamada real al backend cuando exista (catálogo administrado por SUPER_ADMIN,
// INV-001). Forma alineada con src/types/bankAccount.ts — BankAccount.

// Los assets bajo src/ deben importarse como módulo ES para que Vite los
// resuelva y empaquete correctamente; una ruta en string plano (como se
// usaba antes) no funciona en tiempo de ejecución.
//
// Por ahora se usa la MISMA imagen de QR para las 3 cuentas (aún no hay
// un QR real por banco); cuando exista, basta con importar cada archivo
// y asignarlo a su cuenta correspondiente.
import qrPlaceholder from "../../../../assets/qr/qr-nequi.png";

/** @type {import("../../../../types/bankAccount").BankAccount[]} */
export const bankAccounts = [
    {
        bankAccountId: "BANK-001",
        bankName: "Bancolombia",
        accountHolder: "RentaMovil S.A.",
        qrImageUrl: qrPlaceholder,
        isActive: true,
    },
    {
        bankAccountId: "BANK-002",
        bankName: "Nequi",
        accountHolder: "RentaMovil S.A.",
        qrImageUrl: qrPlaceholder,
        isActive: true,
    },
    {
        bankAccountId: "BANK-003",
        bankName: "Davivienda",
        accountHolder: "RentaMovil S.A.",
        qrImageUrl: qrPlaceholder,
        // Inactiva a propósito: sirve para probar INV-002 (el cliente solo puede elegir
        // BankAccount con isActive = true en el checkout; esta debe quedar oculta ahí pero
        // seguir existiendo para el historial de pagos ya hechos a esta cuenta).
        isActive: false,
    },
];

/** Cuentas seleccionables en checkout — filtra por INV-002 (solo is_active = true). */
export const getActiveBankAccounts = () =>
    bankAccounts.filter((account) => account.isActive);