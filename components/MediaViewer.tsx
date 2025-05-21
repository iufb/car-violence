import { getFileType } from "@/utils";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View, ViewProps } from "react-native";

import { Video } from "@/components/Video";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import Constants from 'expo-constants';


interface MediaViewerProps extends ViewProps {
    media: string
    itemStyle: any
}
export const MediaViewer = ({ media, itemStyle, ...props }: MediaViewerProps) => {
    const [uri, setUri] = useState(media)
    const [modalVisible, setModalVisible] = useState(false);
    const handleImgError = () => {
        setUri(
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJ5rAqr1pIi6pHOdFGGijRXcE4HLHqWJNSw&s'
        )
    }
    console.log(uri)
    const closeModal = () => setModalVisible(false);
    return <View style={[props.style]} {...props}>
        <Pressable onPress={() => {
            if (getFileType(media) == 'image') {
                setModalVisible(true)
            }
        }}>
            <View style={itemStyle}>
                {getFileType(media) == 'image' && <Image style={[styles.media]} source={{ uri }} onError={handleImgError} />}
                {getFileType(media) == 'video' && <Video style={[styles.media]} source={uri} />}
            </View>
        </Pressable>

        <Modal visible={modalVisible} onRequestClose={closeModal} animationType="fade"  >
            <Pressable onPress={closeModal} hitSlop={10} style={[styles.close]}>
                <AntDesign color={Colors.light.primary} size={32} name="close" />
            </Pressable>

            <View style={[styles.modal]}>
                {getFileType(media) == 'image' && <Image style={[styles.media]} source={{ uri }} onError={handleImgError} />}
            </View>
        </Modal>
    </View>
}
const styles = StyleSheet.create({
    media: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    modal: {
        paddingTop: Constants.statusBarHeight,
    },
    close: {
        position: 'absolute',
        right: 10,
        zIndex: 10,
        top: Constants.statusBarHeight
    }
})
