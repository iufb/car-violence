import { ScreenContainer } from "@/components";
import { ConfirmationForm } from "@/components/forms";
import { Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { ConfirmationType } from "@/types";
import { formatPhoneNumber } from "@/utils";
import { Tabs, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Confirmation() {
    const params = useLocalSearchParams()
    const data = JSON.parse(params.info as string)
    return <ScreenContainer style={[styles.container]}>
        <Tabs.Screen options={{ headerShown: true }} />
        <View style={[styles.textContainer]}>
            <Typography style={[styles.center]} variant="h2">Введите код подтверждения</Typography>
            <Typography style={[styles.center]} variant="h3">{params.type == 'register' ? "Создание аккаунта" : "Смена пароля"}</Typography>
            <Typography style={[styles.center]} variant="p2">6-значный код
                был отправлен на номер {"\n"}
                <Typography variant="p2">{formatPhoneNumber(data.tel ?? data.phone)}</Typography></Typography>
        </View>
        <ConfirmationForm type={params.type as ConfirmationType} userData={data} />
    </ScreenContainer>
}
const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        gap: 50
    },
    textContainer: {
        marginTop: 80
    },
    center: {
        textAlign: "center"
    },
    again: {
        color: Colors.light.primary
    }
})
