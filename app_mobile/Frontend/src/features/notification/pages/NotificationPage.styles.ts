import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => StyleSheet.create({
    content: { flexGrow: 1, padding: 20, paddingBottom: 36, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
    pageTitle: { flex: 1, fontSize: 25, fontWeight: "800", color: colors.text },
    feedback: { paddingVertical: 28, textAlign: "center", fontSize: 14, color: colors.secondaryText },
    errorText: { color: colors.error },
});
