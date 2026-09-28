import { Platform } from "react-native";

/**
 * Fuentes oficiales de la app.
 *
 * Espejo de `web/Front-end/src/index.css`:
 *
 *   --sans:    'Inter', system-ui, -apple-system, sans-serif;   cuerpo
 *   --heading: 'Poppins', system-ui, -apple-system, sans-serif;   titulos
 *   --mono:    ui-monospace, Consolas, monospace;                 cuentas
 *
 * Los pesos son los que usa el CSS: Poppins 500/600/700 para titulos
 * (h1 700, h2 y .titulo-card 600, base 500) e Inter 400/500/600 para
 * cuerpo, labels y botones.
 *
 * La mono NO se descarga: el web usa la pila monospace del sistema, asi que
 * aqui se resuelve a la de cada plataforma. En web cae en `monospace`, que el
 * navegador traduce a su propia pila, igual que `ui-monospace`.
 */
export const Fonts = {
    sans: {
        regular: "Inter_400Regular",
        medium: "Inter_500Medium",
        semibold: "Inter_600SemiBold",
        bold: "Inter_700Bold",
    },

    heading: {
        medium: "Poppins_500Medium",
        semibold: "Poppins_600SemiBold",
        bold: "Poppins_700Bold",
    },

    mono: Platform.OS === "ios" ? "Menlo" : "monospace",
} as const;

type Weight =
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";

/**
 * Devuelve la familia de cuerpo para un `fontWeight` dado.
 *
 * Sirve para las pantallas que ya declaran `fontWeight` pero no `fontFamily`:
 * basta con envolver el valor, sin tener que elegir familia a mano.
 */
export function sansFor(weight?: Weight): string {
    switch (weight) {
        case "100":
        case "200":
        case "300":
        case "400":
            return Fonts.sans.regular;
        case "500":
            return Fonts.sans.medium;
        case "600":
            return Fonts.sans.semibold;
        default:
            return Fonts.sans.bold;
    }
}
