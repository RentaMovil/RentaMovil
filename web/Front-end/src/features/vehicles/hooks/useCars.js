import { useCallback, useEffect, useState } from "react";
import { carsService } from "../Services/carsService";
import { toClientVehicleViewModel } from "../Services/carsMapper";
import { branchService } from "../../admin/branches/services/branchService";

export  function useCars() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cars, setCars] = useState([]);

    const fetchVehicle = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [vehiclesResponse, branchesResponse] = await Promise.all([
                carsService.getAll(),
                branchService.getAll(),
            ]);
            const branchesById = Object.fromEntries(branchesResponse.map((b) => [b.id, b]));
            setCars(vehiclesResponse.map((v) => toClientVehicleViewModel(v, branchesById))); // <- esto faltaba
        } catch (err) {
            setError(err.message || "No fue posible cargar los vehículos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchVehicle(); }, [fetchVehicle]);

    return { cars, isLoading, error, refetch: fetchVehicle };
}