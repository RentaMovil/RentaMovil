import type { Money } from "./common";

/**
 * Entity: InsuranceType.
 *
 * NO esta en la API mock (mock local en la app). La forma se replica del
 * frontend web: `web/Front-end/src/features/admin/insuranceTypes/services/
 * InsuranceTypesMock.js`, que usa `description`/`price`/`tag` en vez del
 * `coverageDetails`/`dailyCost` del tipo de dominio.
 */
export type InsuranceType = {
  id: string;
  name: string;
  description: string;
  /** Costo por dia del plan. */
  price: Money;
  /** Etiqueta corta para agrupar en la UI: "base" | "popular" | "premium". */
  tag: string;
};

/** Opcion de seguro para el selector (sin la descripcion larga). */
export type InsuranceOption = {
  id: string;
  name: string;
  price: Money;
};
