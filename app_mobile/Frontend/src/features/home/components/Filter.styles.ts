import { StyleSheet } from "react-native";

import { createTextStyles } from "../../../theme/constants/typography";
import { Radius } from "../../../theme/constants/radius";
import { Spacing } from "../../../theme/constants/spacing";

export const filterStyles = (colors: any) => {

  const text = createTextStyles(colors);

  return StyleSheet.create({
    filter: {
      backgroundColor: colors.backgroundCard,
      padding: Spacing.lg,
      gap: Spacing.md,
      borderRadius: 16,
      marginTop: 10,
    },

    row: {
      flexDirection: "row",
      gap: 10,
    },

    field: {
      flex: 1,
      flexDirection: "column",
      gap: 4,
    },

    fieldFull: {
      flexDirection: "column",
      gap: 4,
    },

    labelFilter: {
      marginLeft: 6,
      ...text.overline,
    },

    inputContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: Spacing.lg,
      paddingVertical: 13,
      backgroundColor: colors.input,
      ...text.body,
      fontSize: 14,
      color: colors.text,
    },

    inputInvalid: {
      borderColor: colors.error,
    },

    /**
     * Los campos de fecha y hora son `TouchableOpacity`, no `TextInput`, asi
     * que no pueden usar `inputContainer`: ese estilo lleva propiedades de
     * texto (`fontFamily`, `fontWeight`) y aplicarlo a una View no compila.
     * Este es su equivalente sin texto, y `inputButtonText` el del contenido.
     */
    inputButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: Spacing.lg,
      paddingVertical: 13,
      backgroundColor: colors.input,
    },

    inputButtonText: {
      ...text.body,
      fontSize: 14,
      color: colors.text,
    },

    btnSearch: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },

    btnSearchText: {
      ...text.label,
      fontSize: 16,
      color: colors.buttonText,
    },

    /* --- Sugerencias de sucursal --- */

    suggestions: {
      marginTop: 6,
      maxHeight: 264,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      backgroundColor: colors.card,
      overflow: "hidden",
    },

    suggestion: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    // La sucursal ya elegida se marca con el tinte de acento, igual que en
    // las opciones de seguro y de cuenta bancaria.
    suggestionSelected: {
      backgroundColor: colors.accentBg,
    },

    suggestionIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.input,
    },

    suggestionText: {
      flex: 1,
    },

    suggestionName: {
      ...text.bodyMedium,
      color: colors.textHeading,
    },

    suggestionAddress: {
      ...text.caption,
      fontSize: 12,
      marginTop: 1,
    },

    suggestionCity: {
      alignSelf: "flex-start",
      marginTop: 5,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: Radius.pill,
      backgroundColor: colors.input,
    },

    suggestionCityText: {
      ...text.overline,
      fontSize: 10,
    },

    // Antes no habia ningun aviso cuando la busqueda no daba resultados: el
    // desplegable simplemente no aparecia y el usuario no sabia por que.
    noSuggestions: {
      ...text.caption,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      textAlign: "center",
    },

    error: {
      ...text.caption,
      color: colors.error,
      marginLeft: 6,
      fontSize: 11,
      marginTop: 2,
    },
  });
};
