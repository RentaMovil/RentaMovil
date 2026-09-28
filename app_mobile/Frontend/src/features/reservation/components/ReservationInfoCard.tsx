import { Text, TouchableOpacity, View } from "react-native";

import AppCard from "../../../shared/components/AppCard/AppCard";

import { useReservation } from "../context/ReservationContext";

import { createStyles } from "./ReservationInfoCard.styles";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

type Props = {
  readonly title: string;
  readonly subtitle: string;
  readonly onChangePickup: () => void;
  readonly onChangeReturnBranch: () => void;
};

export default function ReservationInfoCard({
  title,
  subtitle,
  onChangePickup,
  onChangeReturnBranch,
}: Props) {
  const { reservation } = useReservation();

  const { themeName } = useTheme();
  const colors = themes[themeName];

  const styles = createStyles(colors);

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.dot} />

          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>RECOGIDA</Text>

        <Text style={styles.value}>{reservation?.pickupBranch?.name}</Text>

        <TouchableOpacity onPress={onChangePickup}>
          <Text style={styles.link}>Cambiar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>DEVOLUCIÓN</Text>

        <Text style={styles.value}>{reservation?.returnBranch?.name}</Text>

        <TouchableOpacity onPress={onChangeReturnBranch}>
          <Text style={styles.link}>Cambiar</Text>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}
