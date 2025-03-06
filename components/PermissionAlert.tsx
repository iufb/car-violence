import { Button, Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { rV } from "@/utils";
import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const PermissionAlert = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openPermissionAlert", (callback: () => void) => {
            setVisible(true);
        });

        return () => listener.remove();
    }, []);
    return visible &&
        // TODO- weird
        <GestureHandlerRootView style={[{ backgroundColor: 'black' }]}>
            <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={() => setVisible(false)}>
                <View style={[styles.container]}>
                    <View style={[styles.top]} />
                    <View style={[styles.form]}>
                        <Typography center color={Colors.light.primary} variant="h2">Требуется разрешение</Typography>
                        <Typography variant="p1">Для продолжения работы приложения необходимо разрешение на доступ.</Typography>
                        <Typography variant="p2">Перейдите в настройки устройства и включите доступ вручную.</Typography>

                        <View style={[styles.btns]}>
                            <Button onPress={() => Linking.openSettings()} style={[styles.btn]} >Открыть настройки</Button>
                            <Button onPress={() => setVisible(false)} style={[styles.btn]} variant="outline">Закрыть</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView >
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: "white", width: Dimensions.get("window").width, height: Dimensions.get('window').height / 2, marginTop: Dimensions.get('window').height / 2, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10,
    },
    top: {
        width: Dimensions.get('window').width - Dimensions.get('window').width / 2,
        height: rV(4),
        borderRadius: 10,
        marginVertical: rV(10),
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,.8)'
    },
    form: {
        flex: 1,
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

