import { StyleSheet } from "react-native";

import { createCardShadow } from "../../../theme/constants/shadows";

/**
 * Tarjeta base de la app.
 *
 * Spec de `.pay-card` del web: fondo `--card-bg`, borde 1px `--bordercard`,
 * radio 20px y `--shadow`. Antes el radio venia del token `Radius.lg` (16) y
 * no llevaba borde, asi que las tarjetas no coincidian con el web.
 */
export const createStyles = (colors: any) =>

    StyleSheet.create({

        card: {

            backgroundColor: colors.card,

            borderWidth: 1,

            borderColor: colors.cardBorder,

            borderRadius: 20,

            padding: 24,

            marginBottom: 16,

            ...createCardShadow(colors),

        },

    });
