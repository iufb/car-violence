import { Typography, ViewModal } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { useMediaStore } from "@/context/useMediaStore"
import { useCreateModal } from "@/hooks/useCreateModal"
import { DeviceHeigth, Modals, rV } from "@/utils"
import { DeviceEventEmitter, StyleSheet } from "react-native"
import { Pressable } from "react-native-gesture-handler"
type CallbacksType = {
    openCamera: () => void,
    openGallery: () => void

}
export const ImportVariantsModal = () => {
    const { setActiveView } = useMediaStore()
    const { y, visible, callbacks, handleClose } = useCreateModal<CallbacksType>({ event: Modals.importVariants })
    const handleCameraPress = () => {
        setActiveView("camera")
        handleClose()
    }
    const handleGalleryPress = () => {
        DeviceEventEmitter.emit(Modals.assetPicker)
        handleClose()
    }
    return <ViewModal key={'importvariants'} y={y} visible={visible} handleClose={handleClose} modalOffset={DeviceHeigth - rV(150)}>
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
