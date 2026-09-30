import { useCallback, useEffect, useState } from "react";
import { reservationService } from "../services/reservationService";
import { toAdminReservationViewModel } from "../services/reservationMapper";
import { carsService } from "../../vehicles/Services/carsService";
import { branchService } from "../../admin/branches/services/branchService";
import { insuranceService } from "../../admin/insuranceTypes/services/insuranceService";
//import { userService } from "../../admin/userManagement/services/userService";

import { httpClient } from "../../../shared/api/httpClient";

export function useReservationsAdmin() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [
                reservationsRes,
                vehiclesRes,
                branchesRes,
                insuranceRes,
                paymentsRes,
                rentalsRes,
                bankAccountsRes,
                gpsRes
            ] = await Promise.all([
                reservationService.getAll(),
                carsService.getAll(),
                branchService.getAll(),
                insuranceService.getAll(),
                httpClient.get('/payments'),
                httpClient.get('/rentals'),
                httpClient.get('/bankAccounts'),
                httpClient.get('/gps'),
            ]);

            const ctx = {
                vehiclesById: Object.fromEntries(vehiclesRes.map((v) => [v.id, v])),
                branchesById: Object.fromEntries(branchesRes.map((b) => [b.id, b])),
                insuranceById: Object.fromEntries(insuranceRes.map((i) => [i.id, i])),
                paymentsByReservation: Object.fromEntries(paymentsRes.map((p) => [p.reservation_id, p])),
                rentalsByReservation: Object.fromEntries(rentalsRes.map((r) => [r.reservation_id, r])),
                bankAccountsById: Object.fromEntries(bankAccountsRes.map((b) => [b.id, b])),
                gpsById: Object.fromEntries(gpsRes.map((g) => [g.id, g])),
            };

            setReservations(reservationsRes.map((r) => toAdminReservationViewModel(r, ctx)));
        } catch (err) {
            setError(err.message || "No se pudieron cargar las reservas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    return { reservations, isLoading, error, refetch: fetchAll };
}