import { httpClient } from "../../../shared/api/httpClient";
import { toInsuranceViewModel } from "./insuranceMapper";
import type { InsuranceType } from "../../../types";

const RESOURCE = "/insuranceTypes";

/**
 * Acceso al catálogo de seguros.
 *
 * Antes se resolvía localmente con un mock; ahora viene de la misma API
 * real que usa el frontend web (/insuranceTypes).
 */

export async function getInsuranceOptions(): Promise<InsuranceType[]> {
    const response = await httpClient.get<any[]>(RESOURCE);
    return response.map(toInsuranceViewModel);
}