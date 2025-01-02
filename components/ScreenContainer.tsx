import { Colors } from "@/constants/Colors";
import Constants from "expo-constants";
import { ReactNode } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from "react-native";

export const ScreenContainer = ({ style, children }: { children: ReactNode } & ViewProps) => {
    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}><View style={[styles.container, style]}>
        {children}
    </View></TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        padding: 20,
        backgroundColor: Colors.light.background,
        height: '100%',
    }
})
