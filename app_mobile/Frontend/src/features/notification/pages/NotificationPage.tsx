import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { useNotifications } from "../context/NotificationContext";

import {
  filterByType,
  type NotificationFilter,
  type NotificationWithVehicle,
} from "../utils/notificationUtils";

import NotificationCard from "../components/NotificationCard";
import NotificationDetailModal from "../components/NotificationDetailModal";
import NotificationFilterChips from "../components/NotificationFilter";

import { createStyles } from "./NotificationPage.styles";

/**
 * Centro de notificaciones del cliente.
 *
 * Equivalente a `NotificationCenter.jsx` del web: filtros por tipo, lista y
 * modal de detalle. Las diferencias son de forma, no de comportamiento: los
 * filtros van en chips en vez de columna lateral, y la lista se filtra en
 * memoria porque el conjunto ya viene traido de la API.
 */
export default function NotificationPage() {
  const { t } = useTranslation();
  const { themeName } = useTheme();

  const { notifications, unreadCount, isLoading, error, markAsRead } =
    useNotifications();

  const [filter, setFilter] = useState<NotificationFilter>("todos");
  const [selected, setSelected] =
    useState<NotificationWithVehicle | null>(null);

  const colors = themes[themeName];
  const styles = createStyles(colors);

  const visible = filterByType(notifications, filter);

  /**
   * Al abrir una no leida se marca en la API. Si ya estaba leida no se llama:
   * el web hace lo mismo, y evita un PATCH por cada relectura.
   */
  function handlePress(notification: NotificationWithVehicle) {
    setSelected(notification);

    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>
            {t("navbar.linkNotifications")}
          </Text>

          <FontAwesome
            name="bell"
            size={20}
            color={colors.primary}
          />
        </View>

        <NotificationFilterChips
          selected={filter}
          onChange={setFilter}
          unreadCount={unreadCount}
        />

        {isLoading && (
          <Text style={styles.feedback}>{t("notifications.loading")}</Text>
        )}

        {!isLoading && error && (
          <Text style={[styles.feedback, styles.errorText]}>{error}</Text>
        )}

        {!isLoading && !error && visible.length === 0 && (
          <Text style={styles.feedback}>{t("notifications.empty")}</Text>
        )}

        {!isLoading &&
          !error &&
          visible.map((notification) => (
            <NotificationCard
              key={notification.notification_id}
              notification={notification}
              onPress={handlePress}
            />
          ))}
      </ScrollView>

      <NotificationDetailModal
        notification={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
