import { rConfirmUpload, rGetPresignedUrl } from '@/api/violence';
import { getFromStorage, mimeTypes } from '@/utils';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
const django = 'https://m.foxminded.space/api/v1/mediafiles/upload-media/'
const nest = 'https://oko.foxminded.space/upload'

export const useBackgroundUpload = () => {
    const [showToast, setShowToast] = useState(false)

    async function startUpload(asset: MediaLibrary.Asset, media_id: string) {
        const token = await getFromStorage('access');
        if (!token) {
            console.error('No token');
            return;
        }

        // Получаем расширение файла
        const fileNameParts = asset.filename.split('.');
        const fileExt = fileNameParts[fileNameParts.length - 1]?.toLowerCase();
        const assetType = fileExt;

        if (!mimeTypes[assetType as keyof typeof mimeTypes]) {
            console.error(`Unsupported file type: ${assetType}`);
            throw new Error('Unsupported file type')
        }

        const presignedData = await rGetPresignedUrl({
            media_id,
            content_type: mimeTypes[assetType as keyof typeof mimeTypes],
            file_name: asset.filename
        });

        if (!presignedData) {
            Toast.show({ type: 'error', text1: "Ошибка", text2: `Ошибка загрузки медиа` });
            console.error('Error creating upload url');
            return;
        }

        // Получаем корректный URI на iOS
        const getIOSUri = async (uri: string) => {
            try {
                const destinationUri = `${FileSystem.cacheDirectory}temp-img.${fileExt}`
                await FileSystem.copyAsync({ from: asset.uri, to: destinationUri })
                return destinationUri
            } catch (e) {
                console.error('Error getting iOS local URI:', e);
                return null;
            }
        };
        const fileUri = Platform.OS === 'ios' ? await getIOSUri(asset.uri) : asset.uri;
        if (!fileUri) {
            console.error('File URI not found');
            return;
        }
        console.log(asset.uri, "URI")

        const uploadTask = FileSystem.createUploadTask(
            presignedData.upload_url,
            fileUri,
            {
                sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
                uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
                httpMethod: 'PUT',
                fieldName: 'file',
                headers: {
                    'Content-Type': mimeTypes[assetType as keyof typeof mimeTypes],
                },
            },
            (progress) => {
                if (!showToast) {
                    const percent = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100;
                    Toast.show({
                        type: 'upload',
                        props: {
                            progress: Math.floor(percent),
                            fileName: asset.filename,
                            cancel: () => uploadTask.cancelAsync()
                        },
                        autoHide: false
                    });
                    setShowToast(true);
                }
            }
        );

        try {
            console.log('Upload task started');
            await uploadTask.uploadAsync();
            console.log('Upload task finished');

            await rConfirmUpload({ media_id, file_key: presignedData.file_key });
            await FileSystem.deleteAsync(fileUri, { idempotent: true });

        } catch (error) {
            console.error('Upload task error:', error);
            Toast.show({ type: 'error', text1: "Ошибка", text2: `Видео ${asset.filename} не загружено` });

        } finally {
            uploadTask.cancelAsync(); // safe to call even if already finished
            Toast.hide();
            setShowToast(false);
        }
    }

    return { startUpload }
}
