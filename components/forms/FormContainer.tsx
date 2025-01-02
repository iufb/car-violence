import { ReactNode } from "react"
import { KeyboardAvoidingView, Platform, ViewProps } from "react-native"

export const FormContainer = ({ children, style, ...props }: { children: ReactNode } & ViewProps) => {
    return <KeyboardAvoidingView style={[style]} behavior={Platform.OS == 'ios' ? "padding" : undefined}   {...props}>
        {children}
    </KeyboardAvoidingView>
}
