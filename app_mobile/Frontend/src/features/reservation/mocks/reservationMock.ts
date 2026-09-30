import { RESERVATION_STATUS } from "../../../types";

import type { Reservation } from "../../../types";

/**
 * Historial de reservas.
 *
 * NO esta en la API mock, asi que se resuelve localmente. Los importes y
 * fechas se replican del frontend web
 * (`web/Front-end/src/features/booking/data/mocks/reservationsMocks.js`).
 *
 * A diferencia del mock del web, estas reservas van **normalizadas**: el
 * web guarda `vehicle` anidado y `tiempos`/`billing` como bloques; aqui solo
 * quedan los ids (`vehicleId`, `pickupBranchId`, `returnBranchId`) y los
 * importes aplanados. La UI resuelve las relaciones contra sus catalogos,
 * igual que haria un backend de verdad.
 *
 * Los ids de vehiculo (`1`, `2`, `3`) y de sucursal (`BR-01`, `BR-02`) son
 * los mismos que usan los catalogos de la app, para que las relaciones
 * cierren.
 */

export const reservationsMock: Reservation[] = [
  {
    id: "RES-9428",
    created_at: "2026-09-20T00:00:00.000Z",
    status: RESERVATION_STATUS.PENDING_PAYMENT,
    currency: "COP",

    clientId: "91b8db78-090a-4021-90de-73b3b19fe967",
    vehicleId: "1",
    insuranceTypeId: "1",
    pickupBranchId: "BR-01",
    returnBranchId: "BR-02",

    start_date: "2026-09-24T10:00:00.000Z",
    end_date: "2026-10-01T10:00:00.000Z",
    days: 4,

    price_per_day: 80000,
    subtotal_vehicle: 320000,
    insurance_per_day: 20000,
    subtotal_insurance: 80000,
    total_price: 400000,
    insurance_included: true,
  },
  {
    id: "RES-3152",
    created_at: "2026-03-10T00:00:00.000Z",
    status: RESERVATION_STATUS.COMPLETED,
    currency: "COP",

    clientId: "91b8db78-090a-4021-90de-73b3b19fe967",
    vehicleId: "2",
    insuranceTypeId: "2",
    pickupBranchId: "BR-01",
    returnBranchId: "BR-02",

    start_date: "2026-03-15T08:00:00.000Z",
    end_date: "2026-03-18T08:00:00.000Z",
    days: 3,

    price_per_day: 120000,
    subtotal_vehicle: 360000,
    insurance_per_day: 30000,
    subtotal_insurance: 90000,
    total_price: 450000,
    insurance_included: true,
  },
  {
    id: "RES-1044",
    created_at: "2026-02-02T00:00:00.000Z",
    status: RESERVATION_STATUS.CANCELLED,
    currency: "COP",

    clientId: "91b8db78-090a-4021-90de-73b3b19fe967",
    vehicleId: "3",
    pickupBranchId: "BR-01",
    returnBranchId: "BR-02",

    start_date: "2026-02-10T14:00:00.000Z",
    end_date: "2026-02-12T14:00:00.000Z",
    days: 2,

    price_per_day: 70000,
    subtotal_vehicle: 140000,
    insurance_per_day: 0,
    subtotal_insurance: 0,
    total_price: 140000,
    insurance_included: false,
  },
];
