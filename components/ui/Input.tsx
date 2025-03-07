import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaskedTextInput, MaskedTextInputProps } from "react-native-mask-text";

interface InputProps {
    label: string
    required?: boolean
    bg?: 'light' | 'dark'
    name: string
    control: Control<any, any>
    input: Partial<MaskedTextInputProps>
    rules?: Omit<RegisterOptions<any, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
    error?: string;

}
const getBorderStyle = (focused: boolean, error: boolean): "borderNormal" | "borderFocused" | "borderError" => {
    if (focused && !error) {
        return 'borderFocused'
    }
    if (error) {
        return "borderError"
    }
    return 'borderNormal'
}
export const Input = ({ bg, error, rules, name, control, required = true, label, input: { secureTextEntry, onChangeText, ...inputProps } }: InputProps) => {
    const [focused, setFocused] = useState(false)
    const [secure, setSecure] = useState(secureTextEntry)
    const Component = inputProps.mask ? MaskedTextInput : TextInput
    return <Controller name={name} control={control} render={({ field: { onChange, value, onBlur } }) => {
        return <View style={[styles.container]}>
            <View style={[styles.label]}>
                <Typography color={error ? 'red' : bg == 'dark' ? "white" : 'black'} variant="span">{label}
                    {required && <Typography color="red" variant="span"> *</Typography>}
                </Typography>
            </View>
            <View style={[styles.inputContainer, styles.border, styles[getBorderStyle(focused, !!error)], inputProps.multiline && { height: rV(70) }]}>
                <Component
                    //@ts-ignore
                    type={'text'} onChangeText={inputProps.mask ? ((_, value) => onChange(value)) : ((value) => onChange(value))} secureTextEntry={secure} placeholderTextColor={Colors.light.borderColor} onFocus={() => setFocused(true)} onBlur={() => {
                        setFocused(false)
                        onBlur()
                    }} style={[styles.input, styles.base]} {...inputProps} />
                {secureTextEntry &&
                    <Pressable style={[styles.secureToggle]} onPress={() => setSecure(!secure)}>
                        <Feather size={20} name={secure ? "eye-off" : "eye"} />
                    </Pressable>}
            </View>
            {error && <Typography color="red" variant="span">{error}</Typography>}
        </View>
    }} rules={rules} />
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        position: 'relative',
        gap: rS(7)
    },
    base: {
        backgroundColor: Colors.light.background,
        paddingHorizontal: rS(16),
        borderRadius: 12,
        fontSize: rS(14)
    },
    label: {
        flexDirection: 'row',
    },
    input: {
        height: '100%'
    },
    inputContainer: {
        backgroundColor: Colors.light.background,
        position: 'relative',
        width: '100%',
        height: rV(42),
    },
    border: {
        borderWidth: 1,
        borderRadius: 12,
    },
    borderNormal: {
        borderColor: Colors.light.borderColor,
    },
    borderError: {
        borderColor: 'red',
    },
    borderFocused: {
        borderColor: Colors.light.primary,
    },
    secureToggle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        zIndex: 20
    },
})
