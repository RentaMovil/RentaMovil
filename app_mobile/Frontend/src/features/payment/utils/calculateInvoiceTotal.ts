import type { InsuranceType, Vehicle } from "../../../types";

/**
 * Total a pagar: vehiculo por dias + seguro por dias.
 *
 * El seguro es diario en el dominio (INV-007: se cobra una vez por
 * reserva y no se recalcula al extenderla, asi que quien llama debe
 * pasar los diasoriginally pactados).
 */
export function calculateInvoiceTotal(
  days: number,
  vehicle: Vehicle,
  selectedInsurance: InsuranceType | undefined,
): number {
  const vehicleTotal = days * vehicle.price;
  const insuranceTotal = selectedInsurance ? selectedInsurance.price * days : 0;

  return vehicleTotal + insuranceTotal;
}
