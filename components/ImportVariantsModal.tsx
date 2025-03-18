import { Typography, ViewModal } from "@/components/ui"
import { useCreateModal } from "@/hooks/useCreateModal"
import { DeviceHeigth } from "@/utils"
import { Pressable, StyleSheet } from "react-native"
type CallbacksType = {
    openCamera: () => void,
    openGallery: () => void

}
export const ImportVariantsModal = () => {
    const { y, visible, callbacks, handleClose } = useCreateModal<CallbacksType>({ event: 'showImportVariants' })
    const handleCameraPress = () => {
        callbacks?.openCamera()
        handleClose()
    }
    const handleGalleryPress = () => {
        callbacks?.openGallery()
        handleClose()
    }
    return <ViewModal y={y} visible={visible} handleClose={handleClose} modalOffset={DeviceHeigth - 120}>
        <Pressable style={[styles.btn]} onPress={handleCameraPress}><Typography variant="p2">Открыть камеру</Typography></Pressable>
        <Pressable style={[styles.btn]} onPress={handleGalleryPress}><Typography variant="p2">Открыть галерею</Typography></Pressable>
    </ViewModal>
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,

    }
})
