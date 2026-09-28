import { StyleSheet } from "react-native";

import { createTextStyles } from "../../../theme/constants/typography";
import { Radius } from "../../../theme/constants/radius";
import { Spacing } from "../../../theme/constants/spacing";

/**
 * Modal de tema.
 *
 * Reproduce la estructura del selector del web (`AccountView.jsx` +
 * `Account.css`): overlay, tarjeta centrado, rejilla de 2 columnas con un
 * color por modo y un boton de cerrar.
 */
export const createStyles = (colors: any) => {

  const text = createTextStyles(colors);

  return StyleSheet.create({
    /** Fila del desplegable de Configuracion que abre el modal. */
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: Spacing.md,
    },

    triggerLabel: {
      ...text.bodyMedium,
      color: colors.text,
    },

    triggerValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },

    triggerSwatch: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    triggerText: {
      ...text.bodyMedium,
      color: colors.secondaryText,
    },

    /* --- Modal --- */

    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      padding: Spacing.xl,
    },

    container: {
      borderRadius: Radius.card,
      padding: Spacing.xl,
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },

    title: {
      ...text.h3,
      marginBottom: Spacing.lg,
      color: colors.textHeading,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.md,
    },

    card: {
      width: "47%",
      padding: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },

    cardActive: {
      borderColor: colors.textHeading,
      backgroundColor: colors.accentBg,
    },

    /** Muestra del color de marca del tema. */
    swatch: {
      width: "100%",
      height: 54,
      borderRadius: Radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },

    swatchCheck: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },

    swatchCheckText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#111827",
    },

    cardLabel: {
      ...text.bodyMedium,
      marginTop: Spacing.sm,
      textAlign: "center",
      color: colors.text,
    },

    cardLabelActive: {
      color: colors.textHeading,
    },

    cardKey: {
      ...text.overline,
      fontSize: 10,
      textAlign: "center",
      color: colors.secondaryText,
    },

    closeButton: {
      marginTop: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: Radius.md,
      alignItems: "center",
      backgroundColor: colors.input,
    },

    closeText: {
      ...text.label,
      color: colors.textHeading,
    },
  });
};
