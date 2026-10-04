import { useCallback, useEffect, useState } from "react";
import { reservationService } from "../services/reservationService";
import { toReservationViewModel } from "../services/reservationMapper";
import { carsService } from "../../vehicles/Services/carsService";
import { branchService } from "../../admin/branches/services/branchService";
import { insuranceService } from "../../admin/insuranceTypes/services/insuranceService";
// Lista de una petición opcional: si el servicio todavía no existe o falla, queda vacía
const listOrEmpty = (result) =>
    result.status === "fulfilled" && Array.isArray(result.value) ? result.value : [];

export function useReservationsList() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Las reservas son obligatorias; vehículos, sucursales y seguros solo agregan
            // nombres y precios, así que si alguno falla la lista se muestra igual.
            const [reservationsResponse, ...optional] = await Promise.all([
                reservationService.getMine(),
                Promise.allSettled([
                    carsService.getAll(),
                    branchService.getAll(),
                    insuranceService.getAll(),
                ]),
            ]);
            const [vehiclesResponse, branchesResponse, insuranceResponse] = optional[0].map(listOrEmpty);

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