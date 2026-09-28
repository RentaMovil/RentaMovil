import {
    TouchableOpacity,
    Text,
} from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

import { createStyles } from "./ContinueButton.styles";

type Props = {
    readonly title: string;
    readonly onPress: () => void;
    readonly disabled?: boolean;
};

export default function ContinueButton({
    title,
    onPress,
    disabled = false,
}: Props) {

    const { themeName } = useTheme();

    const colors = themes[themeName];

    const styles = createStyles(colors);

    return (

        <TouchableOpacity

            style={[
                styles.button,
                disabled && styles.disabled,
            ]}

            onPress={onPress}

            disabled={disabled}

        >

            <Text style={styles.text}>
                {title}
            </Text>

        </TouchableOpacity>

    );

}