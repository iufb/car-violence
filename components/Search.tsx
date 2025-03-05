import { Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

export const Search = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const closeModal = () => setModalVisible(false);
    return <View style={[styles.container]}>
        <Pressable style={[styles.trigger]} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="search" size={20} color={Colors.light.primary} />
            <Typography color={Colors.light.notSelected} variant="span">Введите номер нарушения...</Typography>
        </Pressable>
        <Modal visible={modalVisible} onRequestClose={closeModal} animationType="fade"  >
            <View style={[styles.modal]}>
                <Pressable onPress={closeModal}>
                    <Typography variant="h1">Закрыть</Typography>
                </Pressable>
            </View>
        </Modal>
    </View>
}
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: Colors.light.slate200,
        marginTop: Constants.statusBarHeight,
        alignItems: 'center',
        paddingVertical: rV(10),
        paddingHorizontal: rS(10),
    },
    trigger: {
        width: '100%',
        height: rV(45),
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: 24,
        paddingVertical: rS(5),
        paddingHorizontal: rS(16),
        flexDirection: 'row', gap: rS(16),
        alignItems: 'center',
    },
    modal: {
        paddingTop: Constants.statusBarHeight
    }
})
