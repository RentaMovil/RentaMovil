import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { createStyles, createAuthStyles } from "./BrandLogo.styles";

type Props = {
  /**
   * `header` es el tamaño del header de navegacion (19px). `auth` es el
   * grande de las pantallas de acceso (26px).
   */
  readonly size?: "header" | "auth";
};

/**
 * Logotipo: "Renta" en color de texto y "Móvil" en el acento del tema.
 *
 * Copia de `.logo-text` / `.logo-container2` del web (`Navbar.css`), que usa
 * `--textNavabar` para la primera parte y `--accent` para la segunda, con el
 * icono de coche tambien en acento. En el movil el acento es `colors.button`.
 *
 * Vive en `shared/` y en un solo archivo a proposito: antes estaba copiado
 * en el header de las tabs, en `LoginPage` y en `RegisterPage`, y la palabra
 * salia bicolor en unas pantallas y en un solo color en otras (el
 * `title: "Renta Móvil"` del Stack). Al tener un unico componente, los
 * colores no pueden divergir entre pantallas.
 *
 * La marca no se traduce: es el nombre comercial.
 */
export default function BrandLogo({ size = "header" }: Props) {
  const { themeName } = useTheme();
  const colors = themes[themeName];

  const isAuth = size === "auth";
  const styles = isAuth ? createAuthStyles(colors) : createStyles(colors);

  return (
    <View style={styles.row}>
      <FontAwesome
        name="car"
        size={isAuth ? 26 : 20}
        color={colors.button}
      />

      <Text style={[styles.text, { color: colors.text }]}>
        Renta
        <Text style={{ color: colors.button }}>Móvil</Text>
      </Text>
    </View>
  );
}
