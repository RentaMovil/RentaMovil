import type { InsuranceType } from "../../../types";

/**
 * Catalogo de planes de seguro.
 *
 * NO esta en la API mock, asi que se resuelve localmente.
 *
 * Los datos se replican del frontend web, de
 * `web/Front-end/src/features/admin/insuranceTypes/services/InsuranceTypesMock.js`,
 * que es la fuente con descripciones completas. El web tiene ademas un mock
 * mas corto en `features/booking/data/mocks/insurance.js` ("Cobertura
 * minima"), pero ese no describe que cubre cada plan.
 *
 * OJO: las tildes y la "/" de "total/parcial" se habian perdido al copiar
 * el texto. Este archivo es la copia fiel; si se edita, editar aqui y en el
 * web, no reescribir a mano.
 *
 * El `id` se normaliza a string, como el resto del dominio.
 */
export const insurance: InsuranceType[] = [
  {
    id: "1",
    name: "Seguro Básico (First Aid)",
    description:
      "Responsabilidad civil obligatoria frente a terceros (daños corporales y materiales). Asistencia en carretera en horario hábil. No cubre daños propios ni hurto total/parcial.",
    price: 25000,
    tag: "base",
  },
  {
    id: "2",
    name: "Protección Estándar (Standard)",
    description:
      "Cubre daños por colisión con deducible del 10% y protección contra robo parcial o total con franquicia mínima. Incluye asistencia en grúa y auxilio mecánico 24 horas a nivel nacional.",
    price: 45000,
    tag: "popular",
  },
  {
    id: "3",
    name: "Protección Total Todo Riesgo (All-Risk)",
    description:
      "Exención total de responsabilidad por colisión (CDW) y robo (TP) sin deducible. Incluye asistencia médica para ocupantes, remolque ilimitado, cobertura de cristales/llantas y vehículo de sustitución inmediato.",
    price: 90000,
    tag: "premium",
  },
];
