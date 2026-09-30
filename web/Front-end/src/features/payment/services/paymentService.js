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
    approve: (id, reviewerId) =>
        httpClient.patch(`/payments/${id}`, {
            status: 'APPROVED',
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString(),
        }),
    reject: (id, reviewerId, reason) =>
        httpClient.patch(`/payments/${id}`, {
            status: 'REJECTED',
            reviewed_by: reviewerId,
            reviewed_at: new Date().toISOString(),
            rejection_reason: reason,
        }),
};

// El comprobante es una imagen/PDF — reutiliza el mismo patrón de subida que ya usamos
// para vehículos/mantenimientos (Cloudinary vía uploadImage), no un servicio nuevo.
import { cloudinaryService } from "../../../shared/services/cloudinaryService";
async function uploadReceipt(file) {
    return cloudinaryService.uploadImage(file);
}