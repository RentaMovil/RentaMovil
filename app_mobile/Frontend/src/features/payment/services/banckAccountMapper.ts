import type { BankAccount } from "../../../types";

export function toBankAccountViewModel(raw: any): BankAccount {
    return {
        id: String(raw.id),
        bankName: raw.bank_name ?? raw.bankName,
        holderName: raw.account_holder ?? raw.holderName,
        accountNumber: raw.account_number ?? raw.accountNumber,
        accountType: raw.account_type ?? raw.accountType ?? "",
        qrImageUrl: raw.qr_image_url ?? raw.qrImageUrl ?? null,
        isActive: raw.is_active ?? raw.isActive,
    };
}