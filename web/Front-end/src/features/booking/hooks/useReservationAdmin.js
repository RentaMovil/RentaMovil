import { useCallback, useEffect, useState } from "react";
import { reservationService } from "../services/reservationService";
import { rentalService } from "../services/rentalService";
import { toAdminReservationViewModel } from "../services/reservationMapper";
import { carsService } from "../../vehicles/Services/carsService";
import { branchService } from "../../admin/branches/services/branchService";
import { insuranceService } from "../../admin/insuranceTypes/services/insuranceService";
//import { userService } from "../../admin/userManagement/services/userService";

import { httpClient } from "../../../shared/api/httpClient";

// Lista de una petición opcional: si el servicio todavía no existe o falla, queda vacía
const listOrEmpty = (result) =>
    result.status === "fulfilled" && Array.isArray(result.value) ? result.value : [];

export function useReservationsAdmin() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Lo de booking es obligatorio: sin reservas no hay pantalla.
            const [reservationsRes, rentalsRes] = await Promise.all([
                reservationService.getAllAdmin(),
                rentalService.getAll(),
            ]);

            // Lo de los demás servicios solo completa la información (nombres, pagos, GPS).
            // Con allSettled, si uno de ellos todavía no existe la pantalla carga igual.
            const optional = await Promise.allSettled([
                carsService.getAll(),
                branchService.getAll(),
                insuranceService.getAll(),
                httpClient.get('/payments'),
                httpClient.get('/bankAccounts'),
                httpClient.get('/gps'),
            ]);
            const [vehiclesRes, branchesRes, insuranceRes, paymentsRes, bankAccountsRes, gpsRes] =
                optional.map(listOrEmpty);

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