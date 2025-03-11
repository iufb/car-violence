import { getFromStorage } from '@/utils';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export const useBackgroundUpload = () => {
    const [showToast, setShowToast] = useState(false)
    async function startUpload(asset: MediaLibrary.Asset, media_id: string) {
        const token = await getFromStorage('access');
        if (!token) {
            console.error('NO token')
            return
        }

        try {
            const uploadTask = FileSystem.createUploadTask(
                'https://m.foxminded.space/api/v1/mediafiles/upload-media/',
                asset.uri,
                {
                    sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'video',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}`
                    },
                    parameters: {
                        media_id
                    }
                },
                (p) => {
                    if (!showToast) {
                        const progressPercent = (p.totalBytesSent / p.totalBytesExpectedToSend) * 100;

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
            setProgress(0)
            setShowToast(false)
        }
    }
    return { startUpload }
}
