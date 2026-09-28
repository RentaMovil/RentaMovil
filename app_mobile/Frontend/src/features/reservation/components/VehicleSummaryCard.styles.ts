import { StyleSheet } from "react-native";

import { Radius } from "../../../theme/constants/radius";
import { Spacing } from "../../../theme/constants/spacing";
import { createTextStyles } from "../../../theme/constants/typography";

/**
 * Resumen del vehiculo en la reserva.
 *
 * El fondo de los badges usaba `colors.cardSecondary`, clave que tampoco
 * existe en `ThemeColors`, asi que salia `undefined`. Ahora usa `input`, que
 * si existe y cumple el mismo papel de superficie sutil.
 */
export const createStyles = (colors: any) => {

  const text = createTextStyles(colors);

  return StyleSheet.create({
    image: {
      width: "100%",
      height: 200,
      borderRadius: Radius.card,
      resizeMode: "cover",
      marginBottom: Spacing.lg,
    },

    content: {
      gap: Spacing.xs,
    },

    // El nombre del vehiculo es el titulo de la pantalla: familia Poppins.
    name: {
      ...text.h2,
      color: colors.textHeading,
    },

    model: {
      ...text.body,
      color: colors.secondaryText,
    },

    infoContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },

    badge: {
      backgroundColor: colors.input,
      borderRadius: Radius.pill,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    badgeText: {
      ...text.label,
      color: colors.text,
    },

    badgeIcon: {
      marginRight: 6,
    },

    price: {
      ...text.h1,
      marginTop: Spacing.lg,
      color: colors.primary,
    },
  });
};
