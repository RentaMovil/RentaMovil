import { StyleSheet } from "react-native";

export const MenuStyles = (colors: any) => StyleSheet.create({
    content: { flexGrow: 1, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
    pageTitle: { fontSize: 25, fontWeight: "800", color: colors.text, marginBottom: 18 },
    option: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 10 },
    optionIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.input },
    optionLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.text },
    badge: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.error },
    badgeText: { fontSize: 12, fontWeight: "700", color: colors.card },
    logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: colors.error, backgroundColor: colors.card },
    logoutText: { fontSize: 16, fontWeight: "700", color: colors.error },
});
