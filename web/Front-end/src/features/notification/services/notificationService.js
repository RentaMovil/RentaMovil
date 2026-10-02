import { useCars } from "../../vehicles/hooks/useCars.js";
import { notificationsMock } from "../data/mocks/notificationsMock.js";
import { attachVehicleToNotifications } from "../utils/notificationsUtils.js";
import { hasRealBackend } from "../../../shared/api/httpClient.js";

const API_URL = import.meta.env.VITE_API_URL;

const getMockNotifications = async () => {
  const vehicles = await useCars();
  return attachVehicleToNotifications(notificationsMock, vehicles);
};

// Las notificaciones son de booking-reservation, que todavía no existe: se usan los datos mock
// hasta que '/notifications' se agregue a REAL_BACKEND_PREFIXES en httpClient.js.
export const getNotifications = async () => {
  if (!API_URL || !hasRealBackend("/notifications")) {
    return getMockNotifications();
  }

  const response = await fetch(`${API_URL}/notifications`);

  if (!response.ok) {
    throw new Error("No fue posible obtener las notificaciones.");
  }

  const notifications = await response.json();
  const vehicles = await getCars();
  return attachVehicleToNotifications(notifications, vehicles);
};

export const markNotificationAsRead = async (notificationId) => {
  if (!API_URL) {
    return Promise.resolve({ success: true, notification_id: notificationId });
  }

  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("No fue posible actualizar la notificación.");
  }

  return response.json();
};
