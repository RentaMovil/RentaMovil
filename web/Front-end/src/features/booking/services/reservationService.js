import { httpClient } from "../../../shared/api/httpClient";
import { toCreateReservationPayload, toUpdateReturnBranchPayload } from "./reservationMapper";

const RESOURCE = "/reservations";

export const reservationService = {
    getAll: () => httpClient.get(RESOURCE),
    create: (reservation, vehicleSubtotal, insuranceSubtotal, totalAmount, clientId) =>
        httpClient.post(RESOURCE, toCreateReservationPayload(reservation, vehicleSubtotal, insuranceSubtotal, totalAmount, clientId)),
    cancel: (id) => httpClient.patch(`${RESOURCE}/${id}`, { status: 'CANCELLED' }),
    updateReturnBranch: (id, returnBranchId) =>
        httpClient.patch(`${RESOURCE}/${id}`, toUpdateReturnBranchPayload(returnBranchId)),
};