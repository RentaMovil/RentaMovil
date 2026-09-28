import type { UUID, ISODateTime, Money } from "./common";

/**
 * Entity: Reservation (Aggregate Root).
 * Bounded Context: Booking & Reservation.
 * Source: 02-domain/entities-and-rules.md.
 *
 * "The business's central record: vehicle selection, dates, branches, optional insurance."
 *
 * NAMING NOTE (requested by the task): "Booking" and "Reservation" are the SAME entity in this
 * domain — there is a single documented Aggregate Root, `Reservation`. "Booking" is only used
 * informally in this codebase (e.g. the `features/booking/` folder name) and must not be modeled
 * as a separate type — do not create a `Booking` type alongside this one.
 */
export type ReservationStatus =
  | "PENDING_PAYMENT"
  | "PENDING_REVIEW"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type Reservation = {
  reservationId: UUID;
  /** FK Person — the reservation holder. Must be authenticated to create the reservation. */
  clientId: UUID;
  /** FK Vehicle. Cannot be changed once the reservation is created (INV-002). */
  vehicleId: UUID;
  /** FK InsuranceType. Optional — at most one per reservation (INV-006). */
  insuranceTypeId?: UUID;
  /** FK Branch — pickup branch. */
  pickupBranchId: UUID;
  /**
   * FK Branch — return branch. Can differ from pickupBranchId with no extra cost (INV-010).
   * Can only be changed up to 3 days before endDate (INV-013).
   */
  returnBranchId: UUID;
  /** Auto-generated at creation time. */
  reservationDate: ISODateTime;
  startDate: ISODateTime;
  /** Can only be modified to EXTEND, never to shorten (INV-003). */
  endDate: ISODateTime;
  /** = vehicle.dailyPrice * days. */
  vehicleSubtotal: Money;
  /**
   * = insuranceType.dailyCost * days, if applicable (optional — only present when
   * insuranceTypeId is set). Charged once per reservation, not recalculated per extra day if the
   * reservation is later extended (INV-007).
   */
  insuranceSubtotal?: Money;
  /** = vehicleSubtotal + insuranceSubtotal (INV-008). */
  totalAmount: Money;
  status: ReservationStatus;
  /** Evidence of accepting the published rental terms before payment. */
  termsAcceptance: {
    accepted: true;
    version: string;
    acceptedAt: ISODateTime;
  };
};
