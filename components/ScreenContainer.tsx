import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from "react-native";

export const ScreenContainer = ({ style, children, keyDismiss = true }: { children: ReactNode, keyDismiss?: boolean } & ViewProps) => {
    return <KeyboardFeedback dismiss={keyDismiss}><View style={[styles.container, style]}>{children}
    </View>
    </KeyboardFeedback>
}
const KeyboardFeedback = ({ dismiss, children }: { dismiss: boolean, children: ReactNode }) => {
    return dismiss ? <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ pointerEvents: 'box-none', backgroundColor: 'red' }}>
        {children}
    </TouchableWithoutFeedback> : children
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.light.background,
        height: '100%',
    }
})
