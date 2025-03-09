import { Colors } from "@/constants/Colors"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
interface ProgressbarProps {
    value: number
}

export const Progressbar = ({ value }: ProgressbarProps) => {
    const [width, setWidth] = useState(0)
    const progress = useSharedValue(0)
    useEffect(() => {
        progress.value = withTiming(value * width / 100, { duration: 300 });
    }, [value, width]);

    const animatedStyles = useAnimatedStyle(() => ({
        width: progress.value
    }))

    return <View onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width)
    }} style={[styles.container]}>
        <Animated.View style={[styles.progress, animatedStyles]} />
    </View>
}
const styles = StyleSheet.create({
    container: {
        height: 14,
        backgroundColor: '#e2e2e2',
        borderRadius: 5

    },
    progress: {
        height: 14,
        borderRadius: 5, backgroundColor: Colors.light.primary
    }

})
