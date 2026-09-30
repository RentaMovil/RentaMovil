import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import ContinueButton from "../../../shared/components/Button/ContinueButton";
import AppCard from "../../../shared/components/AppCard/AppCard";

import { ApiError } from "../../../shared/api/httpClient";
import { useAuth } from "../../auth/context/AuthContext";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

/**
 * Cambio de contrasena.
 *
 * Sustituye al `router.push("/count")` que habia en la pantalla de cuenta:
 * ese boton decia "Cambiar contrasena" pero apuntaba a una ruta que no
 * existe (queda de un renombrado a medias de `AccountRoute`).
 *
 * El endpoint existe de verdad en la API mock: `PATCH /auth/me/password`
 * con `{ currentPassword, newPassword }`, autenticado. Asi que esto no es
 * un placeholder.
 */
export default function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { themeName } = useTheme();
  const styles = createStyles(themes[themeName]);

  function validate(): string | null {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return "Completa todos los campos.";
    }

    if (newPassword !== confirmPassword) {
      return "La nueva contrasena no coincide con la confirmacion.";
    }

    if (newPassword.length < 6) {
      return "La nueva contrasena debe tener al menos 6 caracteres.";
    }

    if (newPassword === currentPassword) {
      return "La nueva contrasena debe ser distinta de la actual.";
    }

    return null;
  }

  async function handleSubmit() {
    const problem = validate();

    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await changePassword(currentPassword, newPassword);

      Alert.alert(
        "Contrasena actualizada",
        "Tu contrasena se cambio correctamente.",
      );

      router.back();
    } catch (err) {
      // El server responde 401 con "Contrasena actual incorrecta".
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "No se pudo actualizar la contrasena.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar contrasena</Text>

      <AppCard>
        <Text style={styles.label}>Contrasena actual</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Tu contrasena actual"
          placeholderTextColor="#8A8A8A"
        />

        <Text style={styles.label}>Nueva contrasena</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Al menos 6 caracteres"
          placeholderTextColor="#8A8A8A"
        />

        <Text style={styles.label}>Confirmar nueva contrasena</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Repite la nueva contrasena"
          placeholderTextColor="#8A8A8A"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ContinueButton
              title="Actualizar contrasena"
              onPress={handleSubmit}
            />
          )}

          <TouchableOpacity
            style={styles.cancel}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </AppCard>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16,
    },

    label: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.secondaryText,
      marginBottom: 7,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      marginBottom: 16,
    },

    error: {
      color: colors.error,
      fontSize: 14,
      marginBottom: 12,
    },

    actions: {
      gap: 12,
    },

    cancel: {
      alignItems: "center",
      paddingVertical: 12,
    },

    cancelText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.secondaryText,
    },
  });
