export function toCreateBankAccountPayload(formData) {
    return {
        bankName: formData.bankName,
        accountHolder: formData.holderName,
        qrImageUrl: formData.qrImageUrl,
    };
}

export function toBankAccountViewModel(account) {
    return {
        id: account.id,
        bankName: account.bankName,
        holderName: account.accountHolder,
        qrImageUrl: account.qrImageUrl,
        isActive: account.isActive,
    };
}
