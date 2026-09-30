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
};

// El comprobante es una imagen/PDF — reutiliza el mismo patrón de subida que ya usamos
// para vehículos/mantenimientos (Cloudinary vía uploadImage), no un servicio nuevo.
import { cloudinaryService } from "../../../shared/services/cloudinaryService";
async function uploadReceipt(file) {
    return cloudinaryService.uploadImage(file);
}