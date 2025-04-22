import { Typography, ViewModal } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { useCreateModal } from "@/hooks/useCreateModal"
import { DeviceHeigth, Modals, rS } from "@/utils"
import { StyleSheet } from "react-native"
import { Pressable } from "react-native-gesture-handler"
type CallbacksType = {
    openCamera: () => void,
    openGallery: () => void

}
export const ImportVariantsModal = () => {
    const { y, visible, callbacks, handleClose } = useCreateModal<CallbacksType>({ event: Modals.importVariants })
    const handleCameraPress = () => {
        callbacks?.openCamera()
        handleClose()
    }
    const handleGalleryPress = () => {
        callbacks?.openGallery()
        handleClose()
    }
    return <ViewModal y={y} visible={visible} handleClose={handleClose} modalOffset={DeviceHeigth - rS(150)}>
        <Pressable hitSlop={10} style={[styles.btn]} onPress={handleCameraPress}><Typography variant="p2">Открыть камеру</Typography></Pressable>
        <Pressable hitSlop={10} style={[styles.btn]} onPress={handleGalleryPress}><Typography variant="p2">Открыть галерею</Typography></Pressable>
    </ViewModal>
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,
        pointerEvents: 'auto',
        zIndex: 100,
        backgroundColor: Colors.light.slate200,
        borderRadius: 10
    }
})
