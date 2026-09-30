import { branches } from "../mocks/branches";

import type { Branch, BranchOption } from "../../../types";

/**
 * Acceso a las sucursales.
 *
 * NO esta en la API mock, asi que se resuelve localmente con el catalogo.
 * Es el unico punto donde la UI conoce la fuente de los datos.
 */
export async function getBranches(): Promise<Branch[]> {
  // Futuro:
  // return supabase
  //   .from("branches")
  //   .select("*");

  return branches;
}

/**
 * Listado ligero para selectores: evita enviar direccion y coordenadas
 * cuando la pantalla solo necesita id y nombre.
 */
export async function getBranchOptions(): Promise<BranchOption[]> {
  const all = await getBranches();

  return all.map((b) => ({ id: b.id, name: b.name }));
}

/**
 * Resuelve una sucursal por id contra el catalogo.
 *
 * Las reservas guardan `pickupBranchId` / `returnBranchId`, nunca el
 * objeto entero, igual que haria un backend. La UI usa esto para pintar el
 * nombre de la sucursal.
 */
export function getBranchById(id: string): Branch | null {
  return branches.find((b) => b.id === id) ?? null;
}
