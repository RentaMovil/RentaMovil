import { useState } from "react";
import { userService } from "../services/userService";

export function useUpdateUserRole() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function updateUserRole(id, role) {
        setIsLoading(true);
        setError(null);
        try {
            await userService.updateRole(id, role);
        } catch (err) {
            setError(err.message || "Error al actualizar el rol");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { updateUserRole, isLoading, error };
}