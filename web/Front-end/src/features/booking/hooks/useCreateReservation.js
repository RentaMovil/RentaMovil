import { useState } from "react";
import { reservationService } from "../services/reservationService";
import { getStoredUser } from "../../auth/services/sessionStorage";
export function useCreateReservation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function createReservation(draft) {
        setIsLoading(true);
        setError(null);
        try {
            const user = getStoredUser();
            return await reservationService.create(draft, user?.id);
        } catch (err) {
            setError(err.message || "Error al crear la reserva");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { createReservation, isLoading, error };
}