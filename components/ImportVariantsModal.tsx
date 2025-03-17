import { Typography, ViewModal } from "@/components/ui"
import { useCreateModal } from "@/hooks/useCreateModal"
import { DeviceHeigth } from "@/utils"
import { useRef } from "react"
import { Pressable, StyleSheet } from "react-native"
type CallbacksType = {
    openCamera: () => void,
    openGallery: () => void

}
export const ImportVariantsModal = () => {
    const { visible, callbacks, handleClose } = useCreateModal<CallbacksType>({ event: 'showImportVariants' })
    const modalRef = useRef<{ close: () => void } | null>(null);
    const handleCameraPress = () => {
        callbacks?.openCamera()
        modalRef.current?.close()
    }
    const handleGalleryPress = () => {
        callbacks?.openGallery()
        modalRef.current?.close()
    }
    return <ViewModal ref={modalRef} visible={visible} handleClose={handleClose} modalOffset={DeviceHeigth - 120}>
        <Pressable style={[styles.btn]} onPress={handleCameraPress}><Typography variant="p2">Открыть камеру</Typography></Pressable>
        <Pressable style={[styles.btn]} onPress={handleGalleryPress}><Typography variant="p2">Открыть галерею</Typography></Pressable>
    </ViewModal>
}

const styles = StyleSheet.create({
    btn: {
        padding: 10,

    }
})
