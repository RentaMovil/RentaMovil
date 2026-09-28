import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import AppCard from "../../../shared/components/AppCard/AppCard";

import { useReservation } from "../context/ReservationContext";

import { createStyles } from "./InsuranceSelector.styles";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";
import { InsuranceType } from "../../../types";

type Props = {
  readonly options: InsuranceType[];
};

/** Separador de miles es-CO, el mismo que usa el web en el precio del plan. */
function formatMoney(value: number): string {
  return value.toLocaleString("es-CO");
}

export default function InsuranceSelector({ options }: Props) {
  const { t } = useTranslation();

  const { reservation, updateInsurance } = useReservation();

  const selectedInsurance = reservation?.insuranceTypeId ?? null;

  const { themeName } = useTheme();
  const colors = themes[themeName as keyof typeof themes];
  const styles = createStyles(colors);

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <FontAwesome
            name="shield"
            size={17}
            color={colors.button}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>{t("insurance.title")}</Text>

          <Text style={styles.subtitle}>
            {t("insurance.subtitle")}
          </Text>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option) => {
          const selected = selectedInsurance === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => updateInsurance(option.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={styles.name}>{option.name}</Text>

                <Text style={styles.description}>
                  {option.description}
                </Text>

                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {t(`insurance.tag.${option.tag}`)}
                  </Text>
                </View>
              </View>

              <View style={styles.price}>
                <Text style={styles.priceText}>
                  ${formatMoney(option.price)}
                </Text>
              </View>

              {/* El web mete un icono de check dentro del radio, no un
                  punto relleno. */}
              <View
                style={[styles.radio, selected && styles.radioSelected]}
              >
                {selected ? (
                  <FontAwesome
                    name="check"
                    size={10}
                    color={colors.buttonText}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </AppCard>
  );
}
