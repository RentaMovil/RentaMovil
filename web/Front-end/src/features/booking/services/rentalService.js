import { httpClient } from "../../../shared/api/httpClient";
import { toCreatePickupPayload, toReturnPayload } from "./rentalMapper";

const RESOURCE = "/rentals";

export const rentalService = {
    getAll: () => httpClient.get(RESOURCE),
    createPickup: (reservationId, gpsId, mileage) =>
        httpClient.post(RESOURCE, toCreatePickupPayload(reservationId, gpsId, mileage)),
    registerReturn: (rentalId, finalMileage) =>
        httpClient.patch(`${RESOURCE}/${rentalId}`, toReturnPayload(finalMileage)),
};