import { ScreenContainer } from "@/components"
import { LoginForm } from "@/components/forms"
import { Typography } from "@/components/ui"
import { Stack } from "expo-router"
import { StyleSheet, View } from "react-native"

export default function Login() {
    return <ScreenContainer style={[styles.container]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.titleContainer]}>
            <Typography variant="h1">Добро пожаловать!</Typography>
        </View>
        <LoginForm />
    </ScreenContainer>
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        gap: 20
    },
    titleContainer: {
        display: 'flex',
        gap: 10
    }
})
