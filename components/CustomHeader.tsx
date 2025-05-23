import { Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { rV } from "@/utils"
import { Entypo } from "@expo/vector-icons"
import Contants from 'expo-constants'
import { useRouter } from "expo-router"
import { Dimensions, Pressable, StyleSheet, View } from "react-native"
export const CustomHeader = ({ title, showBack = true }: { title: string, showBack?: boolean }) => {
    const router = useRouter()
    return <View style={[styles.container]}>
        <View style={[styles.content]}>
            {showBack && <Pressable hitSlop={10} style={[styles.back]} onPress={() => router.back()}>
                <Entypo name="chevron-left" size={32} color={Colors.light.primary} />
            </Pressable>
            }
            <Typography style={[styles.title]} center variant="h3">{title}</Typography>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        paddingTop: Contants.statusBarHeight,
        height: 52 + Contants.statusBarHeight,
        marginHorizontal: 'auto',
        backgroundColor: 'white',

    },
    content: {

        width: Dimensions.get('window').width - 20,
        backgroundColor: '#F1F5F9',
        marginTop: rV(3),
        marginHorizontal: 'auto',
        paddingVertical: rV(12),
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'

    },
    title: {
        color: Colors.light.primary
    },
    back: {
        position: 'absolute',
        left: 10
    }
})
