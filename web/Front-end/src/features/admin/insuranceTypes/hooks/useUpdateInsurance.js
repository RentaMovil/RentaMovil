import { useState } from "react";
import { insuranceService } from "../services/insuranceService";

    export function useUpdateInsurance() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function updateInsurance(id, formData) {
        setIsLoading(true);
        setError(null);
        try {
            await insuranceService.update(id, formData);
        } catch (err) {
            setError(err.message || "Error al actualizar el insurance");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateInsurance, isLoading, error };

}