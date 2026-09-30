import { useState } from "react";
import { reservationService } from "../services/reservationService";

export function useUpdateReturnBranch() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    async function updateReturnBranch(id, returnBranchId) {
        setIsLoading(true); setError(null);
        try {
            await reservationService.updateReturnBranch(id, returnBranchId); 
            }
        catch (err) {
            setError(err.message); throw err; 
        }
        finally { 
            setIsLoading(false); 
        }
    }
    return { updateReturnBranch, isLoading, error };
}