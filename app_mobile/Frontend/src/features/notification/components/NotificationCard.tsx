import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, TouchableOpacity, View } from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import {
  TYPE_ICON,
  type NotificationWithVehicle,
} from "../utils/notificationUtils";

import { createStyles } from "./NotificationCard.styles";

type Props = {
  notification: NotificationWithVehicle;
  onPress: (notification: NotificationWithVehicle) => void;
};

/** Formatea la fecha como el web: `toLocaleString()`. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function NotificationCard({ notification, onPress }: Props) {
  const { themeName } = useTheme();

  const colors = themes[themeName];
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.card, !notification.is_read && styles.cardUnread]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.icon}>
        <FontAwesome
          name={TYPE_ICON[notification.type] ?? "bell"}
          size={16}
          color={colors.primary}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.message}>{notification.message}</Text>

        <Text style={styles.date}>
          {formatDate(notification.sent_date)}
        </Text>
      </View>

      {!notification.is_read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}
