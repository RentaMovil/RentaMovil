import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { themes, type Themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { createStyles } from "./SelectTheme.styles";

/**
 * Selector de tema, en modal.
 *
 * Antes era una fila de muestras metida en el desplegable de "Configuración".
 * Ahora es un modal, que es como lo hace el web
 * (`AccountView.jsx` abre un `.modal-overlay` con un `.theme-grid` de
 * tarjetas y un titulo por modo).
 *
 * Cada tarjeta muestra el color de marca del tema, su etiqueta y el nombre
 * del modo. El emoji (☀️ 🌙 🌊 ⚪) se sustituyo por la muestra de color: el
 * emoji pretendia representar "como se ve el tema" y fallaba en tres de los
 * cuatro casos, ademas de que `sun` y `moon` no existen en el set libre de
 * FontAwesome 5.
 */
export default function ThemeSelector() {
  const { t } = useTranslation();

  const { themeName, setTheme } = useTheme();

  const [visible, setVisible] = useState(false);

  const styles = createStyles(themes[themeName]);

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
      >
        <Text style={styles.triggerLabel}>Tema</Text>

        <View style={styles.triggerValue}>
          <View
            style={[
              styles.triggerSwatch,
              { backgroundColor: themes[themeName].primary },
            ]}
          />

          <Text style={styles.triggerText}>{t(`themes.${themeName}`)}</Text>
        </View>
      </Pressable>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          {/* Evita que el toque dentro cierre el modal. */}
          <Pressable style={styles.container} onPress={() => {}}>
            <Text style={styles.title}>{t("count.seleccionaTema")}</Text>

            <ScrollView contentContainerStyle={styles.grid}>
              {(Object.keys(themes) as Themes[]).map((key) => {
                const active = key === themeName;

                return (
                  <Pressable
                    key={key}
                    style={[styles.card, active && styles.cardActive]}
                    onPress={() => {
                      setTheme(key);
                      setVisible(false);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <View
                      style={[
                        styles.swatch,
                        { backgroundColor: themes[key].primary },
                      ]}
                    >
                      {active ? (
                        <View style={styles.swatchCheck}>
                          <Text style={styles.swatchCheckText}>✓</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text
                      style={[styles.cardLabel, active && styles.cardLabelActive]}
                    >
                      {t(`themes.${key}`)}
                    </Text>

                    <Text style={styles.cardKey}>{key}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>{t("notifications.close")}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
