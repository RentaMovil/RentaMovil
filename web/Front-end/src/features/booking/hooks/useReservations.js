    import { useEffect, useState } from "react";
    import {
    getReservations,
    cancelReservation,
    updateReturnBranch,
    } from "../services/reservationServices.js";
    export const useReservations = () => {
    const [reservas, setReservas] = useState([]);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        const data = await getReservations();
        setReservas(data);
    };

    const handleCancelReservation = async (id) => {
        await cancelReservation(id);

        setReservas((prev) =>
        prev.map((r) =>
            r.id === id
            ? { ...r, status: "cancelada" }
            : r
        )
        );

        setShowCancelModal(false);
        setSelectedReserva(null);
    };

    /**
     * Persiste el cambio de sucursal de devolución (única sucursal que
     * el cliente puede modificar — INV-013) y refresca tanto la lista
     * de reservas como la reserva abierta en el modal de detalle, para
     * que el cambio se vea en toda la pantalla sin recargar.
     */
    const handleUpdateReturnBranch = async (id, returnBranchId) => {
        await updateReturnBranch(id, returnBranchId);

        setReservas((prev) =>
        prev.map((r) =>
            r.id === id
            ? { ...r, returnBranchId }
            : r
        )
        );

        setSelectedReserva((prev) =>
        prev && prev.id === id
            ? { ...prev, returnBranchId }
            : prev
        );
    };

    return {
        reservas,
        selectedReserva,
        showCancelModal,

        setSelectedReserva,
        setShowCancelModal,

        handleCancelReservation,
        handleUpdateReturnBranch,
    };
    };
