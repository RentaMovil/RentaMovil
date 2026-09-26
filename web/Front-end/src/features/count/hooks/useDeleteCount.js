import { useState } from "react";
import { countService } from "../services/countService";

export function useDeleteCount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function deleteCount() { 
        setIsLoading(true);
        setError(null);
        try {
            await countService.deleteAccount();
        } catch (err) {
            setError(err.message || "Error al eliminar la cuenta");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { deleteCount, isLoading, error };
}