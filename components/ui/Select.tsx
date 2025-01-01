import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
interface SelectProps extends ViewProps {
    items: string[];
    value: string;
    label: string;
    onSelect: (value: string) => void
    placeholder?: string;
}
export const Select = ({ label, value, placeholder, onSelect, items, style, ...props }: SelectProps) => {
    const [show, setShow] = useState(false)
    const dropdownHeight = items.length * 40
    const h = useSharedValue(0)
    const rotate = useSharedValue('0deg')
    const opacity = useSharedValue(0)
    const padding = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return { height: h.value, }
    })
    const innerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
    const iconStyle = useAnimatedStyle(() => {
        return { transform: [{ rotate: rotate.value }] }
    })
    useEffect(() => {
        if (show) {
            h.value = withSpring(dropdownHeight, { damping: 15 })
            padding.value = withSpring(10, { damping: 15 })
            opacity.value = withTiming(1, { duration: 100 })
            rotate.value = withSpring('90deg', { damping: 20 })
        } else {
            opacity.value = withSpring(0)
            padding.value = withTiming(0)
            h.value = withTiming(0, { duration: 150 })

            rotate.value = withSpring('0deg', { damping: 20 });
        }
    }, [show, dropdownHeight])
    const toggle = () => {
        setShow(!show)

    }
    return <View style={[styles.container]}>
        <Typography color={Colors.light.background} variant="span">{label}</Typography>
        <Pressable onPress={toggle} style={[styles.label]}>
            <Typography color={value ? Colors.light.primary : Colors.light.borderColor} variant="span">{value ? value : placeholder}</Typography>
            <Animated.View style={[iconStyle]} ><Entypo color={Colors.light.primary} name="chevron-right" size={28} /></Animated.View>
        </Pressable>
        <Animated.View style={[animatedStyle, styles.content]}>
            <Animated.View style={[innerStyle]}>
                {items.map((item, idx) => <Pressable style={[idx == items.length - 1 ? { borderBottomWidth: 0 } : { borderBottomWidth: 1 }, styles.item]} onPress={() => {
                    onSelect(item);
                    toggle()
                }} key={idx}>
                    <Typography variant="p2">{item}</Typography>
                </Pressable>)}
            </Animated.View>
        </Animated.View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        gap: 7,
    },
    label: {
        height: 48,
        borderColor: Colors.light.borderColor,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    content: {
        borderRadius: 10,
        zIndex: 20,
        position: 'absolute',
        left: 10, right: 10,
        top: 75,
        backgroundColor: Colors.light.background,
        overflow: 'hidden',
    },
    item: {
        justifyContent: 'center',
        paddingLeft: 10,
        borderBottomColor: Colors.light.borderColor,
        height: 40

    },

})
