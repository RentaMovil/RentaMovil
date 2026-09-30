import { useCallback, useEffect, useState } from "react";
import { reservationService } from "../services/reservationService";
import { toReservationViewModel } from "../services/reservationMapper";
import { carsService } from "../../vehicles/Services/carsService";
import { branchService } from "../../admin/branches/services/branchService";
import { insuranceService } from "../../admin/insuranceTypes/services/insuranceService";
export function useReservationsList() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [reservationsResponse, vehiclesResponse, branchesResponse, insuranceResponse] =
                await Promise.all([
                    reservationService.getAll(),
                    carsService.getAll(),
                    branchService.getAll(),
                    insuranceService.getAll(),
                ]);

            const vehiclesById = Object.fromEntries(vehiclesResponse.map((v) => [v.id, v]));
            const branchesById = Object.fromEntries(branchesResponse.map((b) => [b.id, b]));
            const insuranceById = Object.fromEntries(insuranceResponse.map((i) => [i.id, i]));

            setReservations(
                reservationsResponse.map((r) =>
                    toReservationViewModel(r, { vehiclesById, branchesById, insuranceById })
                )
            );
        } catch (err) {
            setError(err.message || "No fue posible cargar las reservas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchReservations(); }, [fetchReservations]);

    return { reservations, isLoading, error, refetch: fetchReservations };
}