import { useState } from 'react';
import { maintenanceService } from '../../maintenance/service/maintenanceService';

export function useChangeMaintenanceStatus() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function changeStatus(id, status) {
        setIsLoading(true);
        setError(null);
        try {
            return await maintenanceService.changeStatus(id, status);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    return { changeStatus, isLoading, error };
}
