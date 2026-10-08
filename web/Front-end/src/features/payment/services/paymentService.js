import { httpClient } from "../../../shared/api/httpClient";
import { toCreatePaymentPayload } from "./paymentMapper";

const RESOURCE = "/payments";

export const paymentService = {
    create: async (paymentData) => {
        const receiptFileUrl = paymentData.receiptFile
            ? await uploadReceipt(paymentData.receiptFile)
            : null;
        return httpClient.post(RESOURCE, toCreatePaymentPayload(paymentData, receiptFileUrl));
    },
    // El revisor sale del JWT en el backend; ya no se manda en el cuerpo.
    approve: (id) => httpClient.patch(`${RESOURCE}/${id}/approve`),
    reject: (id, reason, outcome) =>
        httpClient.patch(`${RESOURCE}/${id}/reject`, { reason, outcome }),
    // Para la cola de admin / detalle de reserva: sin reservationId trae todos los pagos.
    getAll: (reservationId) =>
        httpClient.get(reservationId ? `${RESOURCE}?reservationId=${reservationId}` : RESOURCE),
};

// El comprobante es una imagen/PDF — reutiliza el mismo patrón de subida que ya usamos
// para vehículos/mantenimientos (Cloudinary vía uploadImage), no un servicio nuevo.
import { cloudinaryService } from "../../../shared/services/cloudinaryService";
async function uploadReceipt(file) {
    return cloudinaryService.uploadImage(file);
}