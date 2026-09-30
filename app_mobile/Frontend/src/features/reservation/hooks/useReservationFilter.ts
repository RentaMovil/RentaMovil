import { useState } from "react";
import { Reservation } from "../../../types";

export type ReservationFilter =
    | "ALL"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";

export function useReservationFilters(
    reservations: Reservation[]
) {

    const [
        selectedFilter,
        setSelectedFilter,
    ] = useState<ReservationFilter>("ALL");

    const filteredReservations =
        selectedFilter === "ALL"
            ? reservations
            : reservations.filter(

                reservation =>
                    reservation.status ===
                    selectedFilter

            );

    return {

        selectedFilter,

        setSelectedFilter,

        filteredReservations,

    };

}