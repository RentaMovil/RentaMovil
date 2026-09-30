import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native";

import { Branch } from "../../../types/branch";

import { createStyles } from "./BranchSelectorModal.styles";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";


type Props = {
    visible: boolean;
    branches: Branch[];
    onClose: () => void;
    onSelect: (branch: Branch) => void;
};


export default function BranchSelectorModal({
    visible,
    branches,
    onClose,
    onSelect,
}: Props) {


const { themeName } = useTheme();

const colors = themes[themeName as keyof typeof themes];

const styles = createStyles(colors);


return (

<Modal
    visible={visible}
    animationType="slide"
    transparent
>


<View style={styles.overlay}>


<View style={styles.container}>


<Text style={styles.title}>
    Selecciona lugar de devolución
</Text>


<FlatList

data={branches}

keyExtractor={(item)=>item.id.toString()}

renderItem={({item})=>(

<TouchableOpacity

style={styles.branchItem}

onPress={()=>{

    onSelect(item);

    onClose();

}}

>

<Text style={styles.branchName}>
    {item.name}
</Text>

</TouchableOpacity>

)}

/>



<TouchableOpacity
style={styles.closeButton}
onPress={onClose}
>

<Text style={styles.closeText}>
Cancelar
</Text>

</TouchableOpacity>



</View>


</View>


</Modal>

);

}