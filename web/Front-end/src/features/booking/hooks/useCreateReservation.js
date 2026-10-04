import { useState } from "react";
import { reservationService } from "../services/reservationService";
export function useCreateReservation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function createReservation(draft) {
        setIsLoading(true);
        setError(null);
        try {
            // El titular sale del token: no se envía el id del usuario
            return await reservationService.create(draft);
        } catch (err) {
            setError(err.message || "Error al crear la reserva");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { createReservation, isLoading, error };
}