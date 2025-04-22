import { Colors } from "@/constants/Colors"
import { rMS } from "@/utils"
import { StyleSheet, Text, TextProps, View } from "react-native"

export const Typography = ({ color, variant, children, center, style, ...props }: TextProps & { variant: "h1" | "h2" | "h3" | "p1" | 'p2' | "span", center?: boolean, color?: string }) => {
    return <View pointerEvents="none"><Text style={[styles[variant], { color, fontFamily: "Rubik" }, style, center && styles.center,]} {...props} >
        {children}
    </Text></View>
}

const styles = StyleSheet.create({
    h1: {
        fontSize: rMS(28, .5),
        fontWeight: "bold",
        lineHeight: rMS(34, .5),
    },
    h2: {
        fontSize: rMS(20, .5),
        fontWeight: "bold"

    },
    h3: {
        fontSize: rMS(16, .5),
        fontWeight: "bold"

    },
    p1: {
        fontSize: rMS(18, .5),
        fontWeight: "bold",
        color: Colors.light.notSelected

    },
    p2: {
        fontSize: rMS(16, .5),
        color: Colors.light.notSelected

    },
    span: {
        fontSize: rMS(14, .5)
    },
    center: {
        textAlign: 'center'
    }
})
