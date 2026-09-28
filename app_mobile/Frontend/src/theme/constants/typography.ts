import { TextStyle } from "react-native";

import { Fonts } from "../fonts";

/**
 * Escala tipografica.
 *
 * Los tamanos son los que ya usaba la app. Lo que se anade aqui es lo que
 * faltaba: la familia y el interlineado, tomados de `index.css` del web.
 *
 * El CSS declara `font: 18px/145% var(--sans)`, es decir interlineado 1.45.
 * Los `lineHeight` de abajo son el redondeo de tamano * 1.45.
 */
export const Typography = {

    h1: 30,

    h2: 24,

    h3: 20,

    title: 18,

    body: 16,

    caption: 14,

    small: 12,

} as const;

/**
 * TextStyles listos para extender.
 *
 * Se usan con `...text.h2`, dentro de un `StyleSheet.create`. Los nombres
 * siguen el rol, no el tamano, para que un cambio de escala no obligue a
 * renombrar estilos.
 *
 * `overline` cubre el patron que el web repite en sus labels pequenos
 * (`font-size: 0.68rem; font-weight: 700; letter-spacing: 0.5px`), que es
 * como se rotulan numeros de cuenta y totalizadores.
 */
export type TextRole =
  | "h1"
  | "h2"
  | "h3"
  | "title"
  | "body"
  | "bodyMedium"
  | "label"
  | "caption"
  | "overline"
  | "mono";

/**
 * El retorno va anotado como `TextStyle` a proposito: sin el, TypeScript
 * ensancha `fontWeight: "700"` a `string` y despues los `...text.h2`
 * desplegados en un `StyleSheet.create` dejan de ser asignables.
 */
export const createTextStyles = (
  colors: any,
): Record<TextRole, TextStyle> => ({
    h1: {
        fontFamily: Fonts.heading.bold,
        fontSize: Typography.h1,
        fontWeight: "700",
        // El web usa -1.68px sobre 56px; escalado a 30px.
        letterSpacing: -0.9,
        color: colors.text,
    },

    h2: {
        fontFamily: Fonts.heading.semibold,
        fontSize: Typography.h2,
        fontWeight: "600",
        // El web usa -0.24px sobre 24px: aqui, identico.
        letterSpacing: -0.24,
        lineHeight: 28,
        color: colors.text,
    },

    h3: {
        fontFamily: Fonts.heading.semibold,
        fontSize: Typography.h3,
        fontWeight: "600",
        color: colors.text,
    },

    title: {
        fontFamily: Fonts.heading.semibold,
        fontSize: Typography.title,
        fontWeight: "600",
        color: colors.text,
    },

    body: {
        fontFamily: Fonts.sans.regular,
        fontSize: Typography.body,
        fontWeight: "400",
        lineHeight: 23,
        color: colors.text,
    },

    bodyMedium: {
        fontFamily: Fonts.sans.medium,
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 22,
        color: colors.text,
    },

    label: {
        fontFamily: Fonts.sans.semibold,
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
    },

    caption: {
        fontFamily: Fonts.sans.regular,
        fontSize: Typography.caption,
        fontWeight: "400",
        lineHeight: 20,
        color: colors.secondaryText,
    },

    overline: {
        fontFamily: Fonts.sans.semibold,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
        color: colors.secondaryText,
    },

    mono: {
        fontFamily: Fonts.mono,
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
});
