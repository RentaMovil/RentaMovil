import { useState } from "react";
import { countService } from "../services/countService";

export function useUpdateCount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function updateCount(formData) { // sin "id" — siempre es "el usuario actual"
        setIsLoading(true);
        setError(null);
        try {
            await countService.updateProfile(formData);
        } catch (err) {
            setError(err.message || "Error al actualizar el perfil");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateCount, isLoading, error };
}