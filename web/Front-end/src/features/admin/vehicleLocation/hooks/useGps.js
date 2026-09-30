import { useCallback, useEffect, useState } from "react";
import { gpsService } from "../services/gpsService";
import { toGpsViewModel } from "../services/gpsMapper";
export function useGps() {
    const [gpsDevices, setGpsDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGps = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await gpsService.getAll();
            setGpsDevices(response.map(toGpsViewModel));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchGps(); }, [fetchGps]);
    return { gpsDevices, isLoading };
}