import { httpClient } from "../../../shared/api/httpClient";
import { fromApiDateTime } from "../../../shared/utils/apiDate";

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

// Notificaciones in-app de booking, con el token de la sesión (httpClient lo agrega)
export const getNotifications = async () => {
  const notifications = await httpClient.get("/notifications");
  return notifications.map(fromApiNotification);
};

export const markNotificationAsRead = async (notificationId) =>
  fromApiNotification(await httpClient.patch(`/notifications/${notificationId}/read`));
