import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MaskedTextInput, MaskedTextInputProps } from "react-native-mask-text";

interface InputProps extends MaskedTextInputProps {
    label: string
    bg?: 'light' | 'dark'
}
export const Input = ({ label, bg = 'light', style, secureTextEntry, ...props }: InputProps) => {
    const [focused, setFocused] = useState(false)
    const [secure, setSecure] = useState(secureTextEntry)
    return <View style={[styles.container]}>
        <Typography color={bg == 'dark' ? Colors.light.background : Colors.light.text} variant="span">{label}</Typography>
        <MaskedTextInput secureTextEntry={secure} placeholderTextColor={Colors.light.borderColor} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={[styles.input, focused && styles.focused]} {...props} />
        {secureTextEntry &&
            <Pressable style={[styles.secureToggle]} onPress={() => setSecure(!secure)}>
                <Feather size={20} name={secure ? "eye-off" : "eye"} />
            </Pressable>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        position: 'relative',
        gap: 7
    },
    input: {
        height: 48,
        borderColor: Colors.light.borderColor,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16
    },
    focused: {
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    secureToggle: {
        position: "absolute",
        right: 15,
        bottom: 15,
        zIndex: 20
    }
})
