import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => StyleSheet.create({
    card: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 15, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 10 },
    cardUnread: { borderColor: colors.primary },
    icon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.input },
    body: { flex: 1 },
    message: { fontSize: 15, fontWeight: "600", color: colors.text, marginBottom: 4 },
    date: { fontSize: 12, color: colors.secondaryText },
    dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginTop: 6 },
});
