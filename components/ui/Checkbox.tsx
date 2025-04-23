import { Colors } from '@/constants/Colors'
import { Entypo } from '@expo/vector-icons'
import React, { useEffect } from "react"
import { Pressable, StyleSheet, View, ViewProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
interface CheckboxProps extends ViewProps {
    checked: boolean,
    onCheck: () => void
}
export const Checkbox = ({ checked, onCheck, style, ...props }: CheckboxProps) => {
    const scale = useSharedValue(0)
    useEffect(() => {
        scale.value = withSpring(checked ? 1 : 0, { duration: 350 })
    }, [checked, scale])
    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    })

    return <View style={[style, styles.container, checked && styles.checked]} {...props}>
        <Pressable hitSlop={20} onPress={onCheck}>
            <Animated.View style={[animatedIconStyle]}>
                <Entypo name="check" size={20} color={Colors.light.primary} />
            </Animated.View>
        </Pressable>
    </View>

}

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.light.borderColor
    },
    checked: {
        borderColor: Colors.light.primary
    },
})
