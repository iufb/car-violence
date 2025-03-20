import { Button, Typography, ViewModal } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useCreateModal } from "@/hooks/useCreateModal";
import { DeviceHeigth, Modals } from "@/utils";
import * as Linking from 'expo-linking';
import { StyleSheet, View } from "react-native";

export const PermissionAlert = () => {
    const { y, visible, callbacks, handleClose } = useCreateModal({ event: Modals.permission })
    return <ViewModal y={y} visible={visible} modalOffset={DeviceHeigth - 220} handleClose={handleClose}>
        <View style={[styles.form]}>
            <Typography center color={Colors.light.primary} variant="h2">Требуется разрешение</Typography>
            <Typography variant="p1">Для продолжения работы приложения необходимо разрешение на доступ.</Typography>
            <Typography variant="p2">Перейдите в настройки устройства и включите доступ вручную.</Typography>

            <View style={[styles.btns]}>
                <Button onPress={() => Linking.openSettings()} style={[styles.btn]} >Открыть настройки</Button>
                <Button onPress={handleClose} style={[styles.btn]} variant="outline">Закрыть</Button>
            </View>
        </View>
    </ViewModal>
}
const styles = StyleSheet.create({
    form: {
        justifyContent: 'center',
        gap: 10
    },
    btns: {
        flexDirection: 'row',
        gap: 10
    }, btn: {
        flex: 1
    }

})

