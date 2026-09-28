import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import AppCard from "../../../shared/components/AppCard/AppCard";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { usePayment } from "../context/PaymentContext";
import { getActiveBankAccounts } from "../services/paymentService";

import type { BankAccount } from "../../../types";

import { createStyles } from "./BankAccountSelector.styles";

/**
 * Selector de cuenta bancaria de destino.
 *
 * Reemplaza al antiguo `PaymentMethodSelector` (metodos de tarjeta), que no
 * corresponde a este dominio: el pago es transferencia manual y el cliente
 * elige a que cuenta transfiere.
 *
 * Muestra solo cuentas activas (INV-002). El numero de cuenta se muestra
 * completo a proposito: es el dato que el cliente necesita para transferir y
 * el Admin necesita para conciliar.
 */
export default function BankAccountSelector() {
  const { t } = useTranslation();

  const { selectedBankAccount, setSelectedBankAccount } = usePayment();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { themeName } = useTheme();
  const colors = themes[themeName];
  const styles = createStyles(colors);

  /**
   * Copia el numero al portapapeles y muestra la confirmacion un momento.
   *
   * Se usa la Web Clipboard API, que es la que existe sin dependencias
   * extra. En nativo no hay API de portapapeles sin `expo-clipboard`, asi
   * que ahi el boton no hace nada: el numero esta a la vista y se copia a
   * mano, que es justo lo que cubre el number-only.
   */
  async function copyToClipboard(accountId: string, value: string) {
    try {
      if (Platform.OS !== "web" || !navigator?.clipboard) {
        return;
      }

      await navigator.clipboard.writeText(value);

      setCopiedId(accountId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Sin portapapeles disponible: el numero ya esta a la vista para
      // copiarlo a mano, que es justo el caso que cubre el number-only.
    }
  }

  useEffect(() => {
    let cancelled = false;

    getActiveBankAccounts().then((loaded) => {
      if (!cancelled) {
        setAccounts(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Iniciales del banco, para el cuadrado de marca. */
  function initialsOf(name: string): string {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");
  }

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.dot} />

          <Text style={styles.title}>Cuenta de pago</Text>
        </View>

        <Text style={styles.subtitle}>
          Transfiere a una de estas cuentas y sube el comprobante
        </Text>
      </View>

      <View style={styles.accountsContainer}>
        {accounts.map((account) => {
          const selected = selectedBankAccount?.id === account.id;

          return (
            <TouchableOpacity
              key={account.id}
              onPress={() => setSelectedBankAccount(account)}
              style={[
                styles.accountCard,
                selected && styles.selectedAccount,
              ]}
            >
              <View style={styles.accountInfo}>
                <View style={styles.accountTop}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>
                      {initialsOf(account.bankName)}
                    </Text>
                  </View>

                  <View style={styles.radioWrapper}>
                    <Text style={styles.bankName}>{account.bankName}</Text>

                    <Text style={styles.accountType}>
                      {account.accountType}
                    </Text>
                  </View>
                </View>

                <Text style={styles.holder}>{account.holderName}</Text>

                <View style={styles.numberBox}>
                  <Text style={styles.numberLabel}>
                    NUMERO DE CUENTA
                  </Text>

                  <Text style={styles.accountNumber}>
                    {account.accountNumber}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(account.id, account.accountNumber)}
                >
                  <FontAwesome
                    name="copy"
                    size={12}
                    color={colors.textHeading}
                  />

                  <Text style={styles.copyButtonText}>
                    {copiedId === account.id
                      ? t("payment.copied")
                      : t("payment.copyNumber")}
                  </Text>
                </TouchableOpacity>

                {/*
                  QR: no se muestra. `qrImageUrl` es null en todas las cuentas
                  (tambien en el web) y el QR bancario es de valor fijo,
                  mientras que aqui el monto se calcula por reserva. Se deja
                  el hueco commented por si el backend llegara a servirlo:
                  para entonces haria falta generar el QR con el monto, no
                  reutilizar una imagen fija.
                */}
              </View>

              <View
                style={[styles.radio, selected && styles.radioSelected]}
              >
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </AppCard>
  );
}
