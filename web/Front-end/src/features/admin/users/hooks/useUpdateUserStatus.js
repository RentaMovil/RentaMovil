import { useState } from "react";
import { userService } from "../services/userService";

export function useUpdateUserStatus() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function updateUserStatus(id, status) {
        setIsLoading(true);
        setError(null);
        try {
            await userService.updateStatus(id, status);
        } catch (err) {
            setError(err.message || "Error al cambiar el estado");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateUserStatus, isLoading, error };
}
