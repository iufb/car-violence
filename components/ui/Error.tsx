import { Typography } from "@/components/ui/Typography"
import { Colors } from "@/constants/Colors"
import { FontAwesome } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"

export const Error = () => {
    return <View style={[styles.container]}>
        <View style={[styles.icon]}>
            <FontAwesome color={'red'} name="window-close" size={40} />
        </View>
        <Typography variant="h3" color="red" center>Ошибка</Typography>
        <Typography variant="p2">Произошла ошибка при загрузке данных</Typography>
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.status[0],
        borderRadius: 10,
        padding: 10,
        gap: 20,
    },
    icon: {
        alignItems: 'center'
    }
})
