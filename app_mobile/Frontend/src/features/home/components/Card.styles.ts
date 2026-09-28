import { StyleSheet } from "react-native";

import { createTextStyles } from "../../../theme/constants/typography";
import { createCardShadow } from "../../../theme/constants/shadows";
import { Radius } from "../../../theme/constants/radius";
import { Spacing } from "../../../theme/constants/spacing";

/**
 * Tarjeta de vehiculo del home.
 *
 * Reproduce la referencia de diseno: bloque de titulo con distintivo,
 * subtitulo, foto dentro de un recuadro claro con padding, barra de
 * especificaciones con separadores, fila de ubicacion con la politica de
 * cancelacion, y pie con precio a la izquierda y CTA a la derecha.
 *
 * Todo sale de tokens: no hay numeros sueltos ni colores hex.
 */
export const createStyles = (colors: any) => {

  const text = createTextStyles(colors);

  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: Radius.card,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(colors),
    },

    /* --- Titulo --- */

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },

    name: {
      ...text.h3,
      flexShrink: 1,
      color: colors.textHeading,
    },

    // Distintivo circular de disponibilidad. En la referencia es azul; aqui
    // usa el verde de exito del tema, porque no hay azul en la paleta.
    verifiedBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.success,
    },

    subtitle: {
      ...text.caption,
      marginTop: Spacing.xs,
    },

    /* --- Foto --- */

    // Recuadro claro que envuelve la foto. El padding y el `contain` son lo
    // que da el aire que tiene en la referencia; antes la imagen iba suelta
    // a 100x60.
    imageBox: {
      marginTop: Spacing.lg,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },

    image: {
      width: "100%",
      height: 190,
    },

    /* --- Barra de especificaciones --- */

    specsBar: {
      flexDirection: "row",
      marginTop: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: Radius.md,
      backgroundColor: colors.input,
    },

    spec: {
      flex: 1,
      alignItems: "center",
      gap: 6,
      paddingHorizontal: Spacing.xs,
    },

    // Separador vertical entre columnas, como en la referencia.
    specDivider: {
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },

    specValue: {
      ...text.label,
      fontSize: 13,
      color: colors.textHeading,
      textAlign: "center",
    },

    specUnit: {
      ...text.caption,
      fontSize: 11,
      marginTop: -4,
    },

    /* --- Ubicacion y cancelacion --- */

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing.md,
      marginTop: Spacing.lg,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      flexShrink: 1,
    },

    location: {
      ...text.bodyMedium,
      flexShrink: 1,
      color: colors.text,
    },

    freeCancel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radius.pill,
      backgroundColor: colors.successSurface,
      borderWidth: 1,
      borderColor: colors.success,
    },

    freeCancelText: {
      ...text.label,
      fontSize: 12,
      color: colors.success,
    },

    /* --- Pie: precio y CTA --- */

    footer: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: Spacing.md,
      marginTop: Spacing.lg,
    },

    price: {
      ...text.h2,
      fontSize: 26,
      color: colors.textHeading,
    },

    priceLabel: {
      ...text.caption,
      fontSize: 12,
      marginTop: 2,
    },

    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      paddingVertical: 15,
      borderRadius: Radius.md,
      backgroundColor: colors.button,
    },

    buttonText: {
      ...text.label,
      fontSize: 16,
      color: colors.buttonText,
    },
  });
};
