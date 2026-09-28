/**
 * Primitivas y Value Objects compartidos.
 *
 * Espejo de `web/Front-end/src/types/common.ts`. Los nombres coinciden a
 * proposito con los del web: son el mismo dominio.
 */

/** Todos los identificadores del dominio son UUIDs (string). */
export type UUID = string;

/** Todos los datetime del dominio son strings ISO 8601. */
export type ISODateTime = string;

/**
 * Value Object: Money.
 *
 * La API mock (`db.json`) entrega el precio como numero plano (`price: 100000`)
 * sin moneda, asi que la app maneja COP implicito. Cuando el backend real
 * exponga `{ amount, currency }` solo habra que adaptar el mapper.
 */
export type Money = number;

/** Moneda unica del negocio. */
export const CURRENCY = "COP";

/** Formatea un monto en pesos colombianos. */
export function formatMoney(amount: Money): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}
