import { useCallback, useEffect, useState } from "react";
import { bankAccountService } from "../services/bankAccountService";
import { toBankAccountViewModel } from "../services/bankAccountMapper";

export function useBankAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await bankAccountService.getAll();
            setAccounts(response.map(toBankAccountViewModel));
        } catch (err) {
            setError(err.message || "No se pudieron cargar las cuentas bancarias");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    return { accounts, isLoading, error, refetch: fetchAccounts };
}