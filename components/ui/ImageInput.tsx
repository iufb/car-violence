import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { pickImage } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
interface ImageInputProps {
    label: string
    value: string
    setImage: (value: string[]) => void
}
export const ImageInput = ({ label, value, setImage }: ImageInputProps) => {
    return <View style={[styles.container]}>
        <Typography variant="span">{label}</Typography>
        <Pressable style={[styles.input]} onPress={() => pickImage(setImage)} >
            <Entypo name="image" size={24} color={Colors.light.notSelected} />
            <Typography color={Colors.light.borderColor} variant="h3">Выберите фото</Typography>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    container: {
        gap: 7
    },
    input: {
        height: 48,
        flexDirection: 'row',
        paddingHorizontal: 30,
        alignItems: 'center',
        borderRadius: 12,
        gap: 40,
        borderWidth: 1,
        borderColor: Colors.light.borderColor
    },
})
