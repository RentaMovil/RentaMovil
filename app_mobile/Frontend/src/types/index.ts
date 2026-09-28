/**
 * Barrel de tipos de dominio.
 *
 * Espejo de `web/Front-end/src/types/index.ts`. Los nombres coinciden con los
 * del web a proposito: mobile y web son dos clientes del mismo dominio.
 *
 * Tipos con dos caras:
 *  - `common.ts`   primitivas y value objects
 *  - `vehicle.ts`, `user.ts`, `maintenance.ts`  -> entidad en la API mock
 *  - `branch.ts`, `insuranceType.ts`, `bankAccount.ts`,
 *    `reservation.ts`, `payment.ts`            -> entidad sin API, mock local
 *
 * Excepcion documentada: `notification.ts` NO es espejo del web. Sigue la
 * forma que sirve la API mock, que es la fuente de verdad. Ver el propio
 * archivo para el detalle.
 */

export * from "./common";
export * from "./branch";
export * from "./vehicle";
export * from "./insuranceType";
export * from "./bankAccount";
export * from "./reservation";
export * from "./payment";
export * from "./maintenance";
export * from "./user";
export * from "./notification";
