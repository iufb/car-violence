import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export const useBackgroundUpload = () => {
    const [showToast, setShowToast] = useState(false)
    async function startUpload(asset: MediaLibrary.Asset, setProgress: (progress: number) => void) {

        try {
            const uploadTask = FileSystem.createUploadTask(
                'http://10.0.2.2:3000/upload',
                asset.uri,
                {
                    sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'file',

                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
                (progress) => {
                    if (!showToast) {
                        const progressPercent = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100;
                        Toast.show({ type: 'upload', props: { progress: progressPercent, fileName: asset.filename }, autoHide: false })
                        setShowToast(true)
                    }
                }
            );
            const response = await uploadTask.uploadAsync();
            return response
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            Toast.hide()
            setShowToast(false)
        }
    }
    return { startUpload }
}
