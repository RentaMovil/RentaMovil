export function toCreateBankAccountPayload(formData) {
    return {
        bank_name: formData.bankName,
        account_holder: formData.holderName,
        account_number: formData.accountNumber, // no existe en el modelo real — ver nota
        qr_image_url: formData.qrImageUrl,
        is_active: true,
    };
}

export function toBankAccountViewModel(account) {
    return {
        id: account.id,
        bankName: account.bank_name,
        holderName: account.account_holder,
        accountNumber: account.account_number,
        accountType: account.account_type || "",
        qrImageUrl: account.qr_image_url,
        isActive: account.is_active,
    };
}