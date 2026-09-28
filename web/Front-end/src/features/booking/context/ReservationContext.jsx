import {
    createContext,
    useContext,
    useState,
    useMemo,
} from "react";

/**
 * @typedef {import("../../../types/vehicle").Vehicle} Vehicle
 * @typedef {import("../../../types/branch").Branch} Branch
 * @typedef {import("../../../types/reservation").Reservation} Reservation
 */

/**
 * Selection/draft state needed to build a `Reservation` (see
 * 02-domain/entities-and-rules.md, Bounded Context "Booking & Reservation").
 * Covers the flow steps Vehicle -> Dates/Branches -> Insurance, i.e. everything the customer
 * picks BEFORE the Reservation itself is created (no reservationId/status/totals here — those
 * belong to the Reservation once it exists, not to this selection step).
 *
 * Field names are kept exactly as already consumed by existing pages/components
 * (InsuranceSelector, the Reservation page, InvoiceCard, buildReservationRequest) — see the
 * mapping to the `Reservation` entity's own field names below:
 *
 * - vehicle       -> Reservation.vehicleId (FK Vehicle; cannot change once the reservation exists)
 * - insuranceId   -> Reservation.insuranceTypeId (FK InsuranceType; optional, at most one)
 * - pickupDate    -> Reservation.startDate
 * - returnDate    -> Reservation.endDate
 * - pickupBranch  -> Reservation.pickupBranchId (FK Branch)
 * - returnBranch  -> Reservation.returnBranchId (FK Branch; can differ from pickupBranch, no extra cost)
 * - termsAcceptance -> evidence of the version accepted before payment
 *
 * @typedef {Object} ReservationDraft
 * @property {Vehicle|Object|null} vehicle
 * @property {string|null} insuranceId
 * @property {Date|null} pickupDate
 * @property {Date|null} returnDate
 * @property {Branch|Object|null} pickupBranch
 * @property {Branch|Object|null} returnBranch
 * @property {{accepted: boolean, version: string, acceptedAt: string}|null} termsAcceptance
 */

const ReservationContext =
    createContext(null);


export function ReservationProvider({
    children,
}) {

    /** @type {[ReservationDraft, Function]} */
    const [
        reservation,
        setReservation,
    ] = useState({

        insuranceId: null,
        vehicle: null,
        pickupDate: null,
        returnDate: null,
        pickupBranch: null,
        returnBranch: null,
        termsAcceptance: null,

    });


    function updateInsurance(
        insuranceId
    ) {

        setReservation(
            previous => ({

                ...previous,

                insuranceId,

            })
        );

    }

    function updateReservation(data) {
        setReservation(
            previous => ({
                ...previous,
                ...data,
            })
        );
    }

    function clearReservation() {

        setReservation({

            insuranceId: null,
            vehicle: null,
            pickupDate: null,
            returnDate: null,
            pickupBranch: null,
            returnBranch: null,
            termsAcceptance: null,

        });

    }

    const contextValue = useMemo(() => ({
        reservation,
        updateInsurance,
        updateReservation,
        clearReservation,
    }), [reservation]);

    return (

        <ReservationContext.Provider
            value={contextValue}
        >

            {children}

        </ReservationContext.Provider>

    );

}


export function useReservation() {

    const context =
        useContext(
            ReservationContext
        );


    if (!context) {

        throw new Error(
            "useReservation debe utilizarse dentro de ReservationProvider"
        );

    }


    return context;

}
