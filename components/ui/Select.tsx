import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import useDebounce from "@/hooks/useDebounce";
import { rS, rV } from "@/utils";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, ViewProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
interface SelectProps extends ViewProps {
    items: string[];
    value: string;
    label: string;
    onSelect: (value: string) => void
    placeholder?: string;
    required?: boolean
    withSearch?: boolean
    error?: string
}
export const Select = ({ error, withSearch, required = true, label, value, placeholder, onSelect, items, style, ...props }: SelectProps) => {
    const [show, setShow] = useState(false)
    const [searchItems, setSearchItems] = useState(items)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedQuery = useDebounce(searchTerm, 500); // 500ms debounce

    useEffect(() => {
        if (debouncedQuery) {
            setSearchItems(prev => prev.filter(v => v.toLowerCase().includes(debouncedQuery.toLowerCase())))
        } else {
            setSearchItems(items)
        }
    }, [debouncedQuery]);
    const dropdownHeight = items.length * 40
    const h = useSharedValue(0)
    const rotate = useSharedValue('0deg')
    const opacity = useSharedValue(0)
    const padding = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: h.value,
        }
    })
    const innerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
    const iconStyle = useAnimatedStyle(() => {
        return { transform: [{ rotate: rotate.value }] }
    })
    useEffect(() => {
        if (show) {
            h.value = withSpring(dropdownHeight < 300 ? dropdownHeight : 300, { damping: 15 })
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
        <Typography color={Colors.light.background} variant="span">{label}{required && <Typography color="red" variant="span"> *</Typography>}
        </Typography>
        <Pressable onPress={toggle} style={[styles.label]}>
            <Typography color={value ? Colors.light.text : Colors.light.borderColor} variant="p2">{value ? value : placeholder}</Typography>
            <Animated.View style={[iconStyle]} ><Entypo color={Colors.light.primary} name="chevron-right" size={28} /></Animated.View>
        </Pressable>
        <Animated.View style={[animatedStyle, styles.content]}>

            {withSearch &&
                <View style={[styles.search]}>
                    <TextInput style={[styles.searchInput]} value={searchTerm} onChangeText={value => setSearchTerm(value)} />
                    <FontAwesome5 style={[styles.searchIcon]} name="search" size={20} color={Colors.light.primary} />
                </View>}

            <Animated.ScrollView contentContainerStyle={[innerStyle]}>

                {searchItems.length > 0 ? searchItems.map((item, idx) => <Pressable style={[{ borderBottomWidth: idx == items.length - 1 ? 0 : 1 }, styles.item]} onPress={() => {
                    onSelect(item);
                    toggle()
                }} key={idx}>
                    <Typography variant="p2">{item}</Typography>
                </Pressable>) : <Typography center variant="p2">Нет результатов</Typography>}
            </Animated.ScrollView>
        </Animated.View>
        {error && <Typography variant="span" color="red">{error}</Typography>}
    </View>
}
const styles = StyleSheet.create({
    container: {
        gap: 7,
    },
    search: {
        position: 'relative',
        margin: rS(8),
        marginBottom: rS(15)

    },
    searchInput: {
        fontSize: rS(14),
        height: rV(38),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.borderColor,
        paddingLeft: 10
    },
    searchIcon: { position: 'absolute', right: 20, top: 14 },
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
        maxHeight: 200,
        position: 'absolute',
        left: 10,
        right: 10,
        top: 75,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    item: {
        justifyContent: 'center',
        paddingLeft: 10,
        borderBottomColor: Colors.light.borderColor,
        height: 40

    },

})
