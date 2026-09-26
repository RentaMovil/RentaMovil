import { useState } from "react";
import { bankAccountService } from "../services/bankAccountService";

export function useSetBankAccountActive() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function setActive(id, isActive) {
        setIsLoading(true);
        setError(null);
        try {
            await bankAccountService.setActive(id, isActive);
        } catch (err) {
            setError(err.message || "Error al cambiar el estado de la cuenta");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { setActive, isLoading, error };
}