import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { createStyles } from "./AppCard.styles";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";

type Props = {

    children: ReactNode;

    style?: StyleProp<ViewStyle>;

};

export default function AppCard({

    children,

    style,

}: Props) {

    const { themeName } = useTheme();

    const colors = themes[themeName];

    const styles = createStyles(colors);

    return (

        <View

            style={[

                styles.card,

                style,

            ]}

        >

            {children}

        </View>

    );

}