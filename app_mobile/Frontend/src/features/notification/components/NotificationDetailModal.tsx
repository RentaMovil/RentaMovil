import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import {
  STATUS_FALLBACK_LABEL_KEY,
  STATUS_LABEL_KEY,
  type NotificationWithVehicle,
} from "../utils/notificationUtils";

import { createStyles } from "./NotificationDetailModal.styles";

type Props = {
  notification: NotificationWithVehicle | null;
  onClose: () => void;
};

/**
 * Detalle de una notificacion.
 *
 * Mismas filas que el web (mensaje, fecha, estado, vehiculo), pero el estado
 * sale de i18n y el vehiculo de `brand · model`: el web pinta `vehicle.name`,
 * campo que `Vehicle` no tiene, asi que ahi nunca salia.
 */
export default function NotificationDetailModal({
  notification,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { themeName } = useTheme();

  const colors = themes[themeName];
  const styles = createStyles(colors);

  const statusKey = notification
    ? (STATUS_LABEL_KEY[notification.type] ?? STATUS_FALLBACK_LABEL_KEY)
    : STATUS_FALLBACK_LABEL_KEY;

  return (
    <Modal
      visible={notification !== null}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("notifications.detail")}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t("notifications.message")}</Text>

            <Text style={styles.value}>
              {notification?.message ?? ""}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("notifications.date")}</Text>

            <Text style={styles.value}>
              {notification
                ? new Date(notification.sent_date).toLocaleString()
                : ""}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("notifications.state")}</Text>

            <Text style={styles.value}>{t(statusKey)}</Text>
          </View>

          {notification?.vehicle && (
            <View style={styles.row}>
              <Text style={styles.label}>{t("notifications.vehicle")}</Text>

              <Text style={styles.value}>
                {notification.vehicle.brand} · {notification.vehicle.model}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t("notifications.close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
