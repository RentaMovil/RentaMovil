import { useState } from "react";
import { reservationService } from "../services/reservationService";

export function useCancelReservation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    async function cancelReservation(id) {
        setIsLoading(true); setError(null);
        try { 
            await reservationService.cancel(id); 
        }
        catch (err) { 
            setError(err.message); throw err; 
        }
        finally { setIsLoading(false); }
    }
    return { cancelReservation, isLoading, error };
}