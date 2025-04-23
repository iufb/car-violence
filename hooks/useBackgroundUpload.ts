import { rConfirmUpload, rGetPresignedUrl } from '@/api/violence';
import { getFromStorage, mimeTypes } from '@/utils';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
const django = 'https://m.foxminded.space/api/v1/mediafiles/upload-media/'
const nest = 'https://oko.foxminded.space/upload'

export const useBackgroundUpload = () => {
    const [showToast, setShowToast] = useState(false)



    async function startUpload(asset: MediaLibrary.Asset, media_id: string) {
        const token = await getFromStorage('access');
        if (!token) {
            console.error('No token')
            return
        }
        const assetTypeArray = asset.filename.split('.')
        const assetType = assetTypeArray[assetTypeArray.length - 1]

        const presignedData = await rGetPresignedUrl({
            media_id, content_type: mimeTypes[assetType as keyof typeof mimeTypes], file_name: asset.filename
        })
        if (!presignedData) {

            Toast.show({ type: 'error', text1: "Ошибка", text2: `Ошибка загрузки медиа` })
            console.error('Error creating upload url');
            return
        };


        const uploadTask = FileSystem.createUploadTask(
            presignedData.upload_url,
            asset.uri,
            {
                sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
                httpMethod: 'PUT',
                fieldName: 'file',
                headers: {
                    'Content-Type': mimeTypes[assetType as keyof typeof mimeTypes],
                },
            },

            (p) => {
                if (!showToast) {
                    const progressPercent = (p.totalBytesSent / p.totalBytesExpectedToSend) * 100;

                    Toast.show({ type: 'upload', props: { progress: Math.floor(progressPercent), fileName: asset.filename, cancel: () => uploadTask.cancelAsync() }, autoHide: false })
                    setShowToast(true)
                }
            }
        );
        try {
            await uploadTask.uploadAsync();
            await rConfirmUpload({ media_id, file_key: presignedData.file_key })


        } catch (error) {
            Toast.show({ type: 'error', text1: "Ошибка", text2: `Видео ${asset.filename} не загружено ` })
            console.error('Error uploading file to S3:', error);
        } finally {
            uploadTask.cancelAsync()
            Toast.hide()
            setShowToast(false)
        }
    }
    return { startUpload }
}
