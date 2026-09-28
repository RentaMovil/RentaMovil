import { StyleSheet } from "react-native";

import { createCardShadow } from "./shadows";
import { createTextStyles } from "./typography";

/**
 * Especificacion de tarjeta y encabezado de seccion.
 *
 * Copia de las clases `.pay-card*` y `.pay-badge*` de
 * `web/Front-end/src/features/payment/pages/Payment.css`, para que las
 * tarjetas del movil tengan la misma forma que las del web en vez de
 * definirse a mano en cada pantalla.
 *
 * Valores tomados del CSS:
 *   .pay-card        1px solid --bordercard, radius 20px, padding 24px
 *   .pay-card-header borde inferior 1px --border, padding-bottom 16px
 *   .pay-card-title  --heading 18px/700
 *   .pay-card-badge  --accent-bg / --accent-border, radius 999, 12px/700
 */
export const createCardStyles = (colors: any) => {
  const text = createTextStyles(colors);

  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      ...createCardShadow(colors),
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    headerText: {
      flex: 1,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    // El punto de acento que el web pone delante de cada titulo de tarjeta.
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.button,
    },

    title: {
      ...text.title,
      fontSize: 18,
      fontWeight: "700",
      color: colors.textHeading,
    },

    subtitle: {
      ...text.caption,
      marginTop: 6,
      color: colors.text,
      opacity: 0.75,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.accentBg,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },

    badgeText: {
      ...text.overline,
      color: colors.primaryDark,
    },
  });
};
