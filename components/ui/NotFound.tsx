import { Typography } from "@/components/ui/Typography"
import { Colors } from "@/constants/Colors"
import { FontAwesome } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"

export const NotFound = () => {
    return <View style={[styles.container]}>
        <View style={[styles.icon]}>
            <FontAwesome color={'green'} name="question-circle-o" size={40} />
        </View>
        <Typography variant="h3" color="green" center>Не найдено</Typography>
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.status[2],
        borderRadius: 10,
        padding: 10,
        gap: 20,
    },
    icon: {
        alignItems: 'center'
    }
})
