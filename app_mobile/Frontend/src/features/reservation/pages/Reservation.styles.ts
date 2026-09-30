import { StyleSheet } from "react-native";

import { createTextStyles } from "../../../theme/constants/typography";
import { Spacing } from "../../../theme/constants/spacing";

export const createStyles = (colors: any) => {

  const text = createTextStyles(colors);

  return StyleSheet.create({
    content: {
      padding: Spacing.lg,
      paddingBottom: 40,
      backgroundColor: colors.background,
    },

    // Estado vacio: sin reserva activa no hay nada que mostrar.
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.xl,
      backgroundColor: colors.background,
    },

    emptyTitle: {
      ...text.h3,
      textAlign: "center",
      color: colors.textHeading,
    },

    emptyText: {
      ...text.body,
      marginTop: Spacing.sm,
      textAlign: "center",
      color: colors.secondaryText,
    },
  });
};
