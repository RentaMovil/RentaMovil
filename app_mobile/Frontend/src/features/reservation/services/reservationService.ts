import { httpClient } from "../../../shared/api/httpClient";
import type { Reservation, ReservationRequest, ReservationResponse } from "../../../types";
import { getInsuranceOptions } from "../../insurance/services/insuranceService";
import { vehicleService } from "../../vehicles/services/vehicleService";
import { toCreateReservationPayload, toReservationResponse, toReservationViewModel } from "./reservationMapper";

const RESOURCE = "/reservations";

export async function createReservation(
    data: ReservationRequest,
    clientId: string,
): Promise<ReservationResponse> {
    const vehicle = await vehicleService.getVehicleById(data.vehicleId);
    if (!vehicle) {
        throw new Error("No se encontro el vehiculo de la reserva.");
    }

    const insurance = data.insuranceTypeId
        ? (await getInsuranceOptions()).find((option) => option.id === data.insuranceTypeId)
        : undefined;
    if (data.insuranceTypeId && !insurance) {
        throw new Error("No se encontro el seguro seleccionado.");
    }

    const payload = toCreateReservationPayload(data, clientId, vehicle, insurance);
    const raw = await httpClient.post<any>(RESOURCE, payload);
    return toReservationResponse(raw);
}

export async function getMyReservations(clientId: string): Promise<Reservation[]> {
    const all = await httpClient.get<any[]>(RESOURCE);
    return all
        .filter((reservation) => String(reservation.client_id ?? reservation.clientId) === String(clientId))
        .map(toReservationViewModel);
}

export async function getReservationById(id: string): Promise<Reservation | undefined> {
    try {
        const raw = await httpClient.get<any>(`${RESOURCE}/${id}`);
        return toReservationViewModel(raw);
    } catch {
        return undefined;
    }
}

export async function cancelReservation(id: string): Promise<Reservation | undefined> {
    const raw = await httpClient.patch<any>(`${RESOURCE}/${id}`, { status: "CANCELLED" });
    return toReservationViewModel(raw);
}