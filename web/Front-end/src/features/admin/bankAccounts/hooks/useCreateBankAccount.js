import { useState } from "react";
import { bankAccountService } from "../services/bankAccountService";

export function useCreateBankAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function createBankAccount(formData) {
        setIsLoading(true);
        setError(null);
        try {
            return await bankAccountService.create(formData);
        } catch (err) {
            setError(err.message || "Error al crear la cuenta bancaria");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { createBankAccount, isLoading, error };
}