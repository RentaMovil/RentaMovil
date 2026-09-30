/**
 * Entity: Branch.
 *
 * NO esta en la API mock (se resuelve con un mock local de la app) y la
 * forma se toma del frontend web: `web/Front-end/src/shared/mocks/branches.js`.
 *
 * El tipo de dominio del web (`src/types/branch.ts`) usa `branchId`, pero su
 * propio mock usa `id` y el web lo dejo asi a proposito para no romper a sus
 * consumidores. Aqui se replica el mock (`id`), que es lo que estableciste.
 */
export type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
};

/** Resumen para los selectores de sucursal (evita traer direccion y coords). */
export type BranchOption = {
  id: string;
  name: string;
};
