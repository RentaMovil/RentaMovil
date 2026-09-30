import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { useAuth } from "../../auth/context/AuthContext";

import { useNotifications } from "../../notification/context/NotificationContext";

import { MenuStyles } from "./MenuPage.styles";

/**
 * Menu lateral de la app.
 *
 * Reemplaza el andamiaje que traia el template de Expo, que exponia un
 * enlace "/auth/login" dentro del menu. Ese enlace era redundante: el login
 * no es un destino al que se navega, es la pantalla a la que `app/_layout.tsx`
 * redirige cuando no hay sesion, y a la que se vuelve tras cerrar sesion.
 * Por eso aqui solo hay destinos reales.
 *
 * El logout vive tambien en Cuenta; se repite aqui porque es la accion que
 * el usuario busca en un menu, no dentro de un formulario de perfil.
 */
export default function MenuPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const { themeName } = useTheme();
    const { logout } = useAuth();
    const { unreadCount } = useNotifications();

    const colors = themes[themeName];
    const styles = MenuStyles(colors);

    async function handleLogout() {
        await logout();
        router.replace("/auth/login");
    }

    const options = [
        { key: "menu.home", icon: "home", href: "/" },
        { key: "menu.reservations", icon: "bookmark", href: "/reservations" },
        {
            key: "navbar.linkNotifications",
            icon: "bell",
            href: "/notifications",
        },
        { key: "menu.account", icon: "user", href: "/account" },
    ] as const;

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.pageTitle}>{t("menu.title")}</Text>

            <View>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        style={styles.option}
                        onPress={() => router.push(option.href)}
                    >
                        <View style={styles.optionIcon}>
                            <FontAwesome
                                name={option.icon}
                                size={17}
                                color={colors.primary}
                            />
                        </View>

                        <Text style={styles.optionLabel}>
                            {t(option.key)}
                        </Text>

                        {option.href === "/notifications" &&
                            unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}

                        <FontAwesome
                            name="chevron-right"
                            size={15}
                            color={colors.secondaryText}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <FontAwesome
                    name="sign-out"
                    size={17}
                    color={colors.error}
                />

                <Text style={styles.logoutText}>
                    {t("menu.logout")}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
