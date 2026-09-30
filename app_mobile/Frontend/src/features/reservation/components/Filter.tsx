import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    ReservationFilter,
} from "../hooks/useReservationFilter";

import {
    createStyles,
} from "./Filter.styles";

import {
    themes,
} from "../../../theme/themes";

import {
    useTheme,
} from "../../../theme/useTheme";

type Props = {

    selectedFilter:
        ReservationFilter;

    onChangeFilter: (
        filter: ReservationFilter
    ) => void;

};

export default function ReservationFilters({

    selectedFilter,

    onChangeFilter,

}: Props) {

    const {
        themeName,
    } = useTheme();

    const colors =
        themes[themeName];

    const styles =
        createStyles(colors);

    return (

        <View
            style={styles.container}
        >

            <TouchableOpacity

                style={[

                    styles.button,

                    selectedFilter === "ALL" &&
                    styles.activeButton,

                ]}

                onPress={() =>
                    onChangeFilter("ALL")
                }

            >

                <Text

                    style={[

                        styles.text,

                        selectedFilter === "ALL" &&
                        styles.activeText,

                    ]}

                >

                    Todas

                </Text>

            </TouchableOpacity>


            <TouchableOpacity

                style={[

                    styles.button,

                    selectedFilter === "CONFIRMED" &&
                    styles.activeButton,

                ]}

                onPress={() =>
                    onChangeFilter("CONFIRMED")
                }

            >

                <Text

                    style={[

                        styles.text,

                        selectedFilter === "CONFIRMED" &&
                        styles.activeText,

                    ]}

                >

                    Activas

                </Text>

            </TouchableOpacity>


            <TouchableOpacity

                style={[

                    styles.button,

                    selectedFilter === "COMPLETED" &&
                    styles.activeButton,

                ]}

                onPress={() =>
                    onChangeFilter("COMPLETED")
                }

            >

                <Text

                    style={[

                        styles.text,

                        selectedFilter === "COMPLETED" &&
                        styles.activeText,

                    ]}

                >

                    Completadas

                </Text>

            </TouchableOpacity>


            <TouchableOpacity

                style={[

                    styles.button,

                    selectedFilter === "CANCELLED" &&
                    styles.activeButton,

                ]}

                onPress={() =>
                    onChangeFilter("CANCELLED")
                }

            >

                <Text

                    style={[

                        styles.text,

                        selectedFilter === "CANCELLED" &&
                        styles.activeText,

                    ]}

                >

                    Canceladas

                </Text>

            </TouchableOpacity>

        </View>

    );

}