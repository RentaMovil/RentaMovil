import { useCars } from "../../vehicles/hooks/useCars.js";
import { notificationsMock } from "../data/mocks/notificationsMock.js";
import { attachVehicleToNotifications } from "../utils/notificationsUtils.js";
import { httpClient } from "../../../shared/api/httpClient";
import { fromApiDateTime } from "../../../shared/utils/apiDate";

const API_URL = import.meta.env.VITE_API_URL;

// Tipos de booking -> tipos que muestra la interfaz (NOTIFICATION_TYPES).
// Los que no tienen equivalente visual caen en "recordatorio"; el tipo original
// queda en backend_type.
const UI_TYPE = {
  PAYMENT_APPROVED: "pago_confirmado",
  RESERVATION_CANCELLED: "reserva_cancelada",
  RESERVATION_EXPIRED: "reserva_cancelada",
};

// Respuesta de booking (camelCase) -> forma que usan los componentes (snake_case)
const fromApiNotification = (notification) => ({
  notification_id: notification.id,
  type: UI_TYPE[notification.type] ?? "recordatorio",
  backend_type: notification.type,
  message: notification.message,
  sent_date: fromApiDateTime(notification.sentDate),
  is_read: notification.read,
  reservation_id: notification.reservationId,
  // Booking no guarda el vehículo en la notificación; el mensaje ya lo describe
  vehicle: null,
});

const getMockNotifications = async () => {
  const vehicles = await useCars();
  return attachVehicleToNotifications(notificationsMock, vehicles);
};

// Sin VITE_API_URL se usan los datos de prueba. Con ella, se consume booking a
// través del gateway, con el token de la sesión (httpClient lo agrega).
export const getNotifications = async () => {
  if (!API_URL) {
    return getMockNotifications();
  }

  const notifications = await httpClient.get("/notifications");
  return notifications.map(fromApiNotification);
};

export const markNotificationAsRead = async (notificationId) => {
  if (!API_URL) {
    return Promise.resolve({ success: true, notification_id: notificationId });
  }

  return fromApiNotification(await httpClient.patch(`/notifications/${notificationId}/read`));
};
