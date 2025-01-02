import { ReactNode } from "react"
import { KeyboardAvoidingView, Platform } from "react-native"

export const FormContainer = ({ children }: { children: ReactNode }) => {
    return <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : undefined} >
        {children}
    </KeyboardAvoidingView>
}
