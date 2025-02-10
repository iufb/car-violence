import { Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { Image, StyleSheet, View, ViewProps } from "react-native"
import { EditProfileButton } from "./EditProfileButton"
const lvl = [require("../assets/user/lvl-1.png"), require("../assets/user/lvl-2.png"), require("../assets/user/lvl-3.png"), require("../assets/user/lvl-4.png"), require("../assets/user/lvl-5.png"),]
export const ProfileSection = ({ style, ...props }: ViewProps) => {
    return <View style={[styles.container, style]}>
        <View>
            {/* <Image style={[styles.lvl]} source={lvl[0]} /> */}
            <Image style={[styles.img]} source={require('../assets/user/Avatar.png')} />
            <EditProfileButton />
        </View>
        <View style={[styles.textContainer]}>
            <Typography center variant="h2">+7 (777) 322 32 32</Typography>
            <Typography color={Colors.light.notSelected} center variant="p2">Иван Иванов</Typography>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 10
    },
    textContainer: {},
    img: {
        width: 120,
        height: 120
    },
    lvl: {
        width: 32, height: 32, position: "absolute",
        right: 0,
        zIndex: 10,
    }
})
