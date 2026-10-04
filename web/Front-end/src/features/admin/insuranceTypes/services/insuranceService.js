import { httpClient } from "../../../../shared/api/httpClient";
import { fromApiInsurancePlan, toCreateInsurancePayload } from "./insuranceMapper";

// Planes de seguro de booking-reservation, bajo /reservations porque el gateway solo
// enruta /reservations/**, /rentals/** y /notifications/** hacia booking:
//   GET  /reservations/insurance-types  público: el cliente los ve antes de iniciar sesión (HU-BOOKING-002)
//   POST /reservations/insurance-types  solo Administrador (HU-BOOKING-009)
const RESOURCE = "/reservations/insurance-types";

const notSupported = (action) =>
    Promise.reject(new Error(`Booking todavía no permite ${action} planes de seguro.`));

export const insuranceService = {
    getAll: async () => (await httpClient.get(RESOURCE)).map(fromApiInsurancePlan),

    // Con fechas, cada plan trae además su costo total para ese rango
    getAllWithQuote: async (startDate, endDate) => {
        const query = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        return (await httpClient.get(`${RESOURCE}${query}`)).map(fromApiInsurancePlan);
    },

    create: async (formData) =>
        fromApiInsurancePlan(await httpClient.post(RESOURCE, toCreateInsurancePayload(formData))),

    // Booking no tiene endpoints para editar ni borrar planes: hay reservas que ya los usan
    // y hay que decidir qué pasa con ellas antes de permitirlo.
    update: () => notSupported("editar"),
    remove: () => notSupported("eliminar"),
};
