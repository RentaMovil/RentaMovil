import { insurance } from "../mocks/insurance";

import type { InsuranceType } from "../../../types";

/**
 * Acceso al catalogo de seguros.
 *
 * NO esta en la API mock, asi que se resuelve localmente. La consumen las
 * features payment y reservation, por eso queda detras de un servicio y no
 * se importa desde `mocks/` directamente.
 */
export async function getInsuranceOptions(): Promise<InsuranceType[]> {
  // Futuro:
  // return supabase
  //   .from("insurance_types")
  //   .select("*");

  return insurance;
}
