import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import {
  FILTER_LABEL_KEY,
  NOTIFICATION_FILTERS,
  type NotificationFilter,
} from "../utils/notificationUtils";

import { createStyles } from "./NotificationFilter.styles";

type Props = {
  selected: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  /** Contador de no leidas. Solo se muestra en el filtro "todos". */
  unreadCount: number;
};

/**
 * Filtros por tipo.
 *
 * El web los presenta en una columna lateral; en movil van como chips
 * horizontales envueltos, que es lo que ya hace
 * `features/reservation/components/Filter.tsx`.
 */
export default function NotificationFilterChips({
  selected,
  onChange,
  unreadCount,
}: Props) {
  const { t } = useTranslation();
  const { themeName } = useTheme();

  const colors = themes[themeName];
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {NOTIFICATION_FILTERS.map((filter) => {
        const isActive = selected === filter;

        return (
          <TouchableOpacity
            key={filter}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onChange(filter)}
          >
            <View style={styles.label}>
              <Text style={[styles.text, isActive && styles.activeText]}>
                {t(FILTER_LABEL_KEY[filter])}
              </Text>

              {filter === "todos" && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeActiveText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
