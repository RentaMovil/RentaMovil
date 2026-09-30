import { StyleSheet } from "react-native";

export function createStyles(colors: any) {
    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
        },
        screen: {
            flexGrow: 1,
            paddingBottom: 28,
            backgroundColor: colors.background,
        },
        container: {
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 8,
        },
        eyebrow: {
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 1.2,
            color: colors.primary,
        },
        title: {
            marginTop: 4,
            fontSize: 28,
            fontWeight: "800",
            color: colors.text,
        },
        subtitle: {
            marginTop: 8,
            fontSize: 15,
            color: colors.secondaryText,
        },
        count: {
            alignSelf: "flex-start",
            marginTop: 16,
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 999,
            backgroundColor: colors.card,
            fontSize: 14,
            fontWeight: "600",
            color: colors.primary,
        },
        emptyState: {
            marginHorizontal: 20,
            marginTop: 28,
            padding: 24,
            alignItems: "center",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
        },
        emptyTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.text,
        },
        emptyText: {
            marginTop: 7,
            fontSize: 14,
            textAlign: "center",
            color: colors.secondaryText,
        },
    });
}
