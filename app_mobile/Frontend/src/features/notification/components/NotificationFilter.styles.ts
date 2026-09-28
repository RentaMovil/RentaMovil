import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => StyleSheet.create({
    container: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    button: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
    activeButton: { borderColor: colors.primary, backgroundColor: colors.primary },
    text: { fontSize: 13, fontWeight: "600", color: colors.secondaryText },
    activeText: { color: colors.buttonText },
    label: { flexDirection: "row", alignItems: "center", gap: 6 },
    badge: { minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.error },
    badgeActiveText: { fontSize: 11, fontWeight: "700", color: colors.card },
});
