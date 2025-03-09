import * as FileSystem from 'expo-file-system';

export const useBackgroundUpload = () => {
    async function startUpload(fileUri: string, setProgress: (progress: number) => void) {

        try {
            const uploadTask = FileSystem.createUploadTask(
                'http://10.0.2.2:3000/upload',
                fileUri,
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
                    const progressPercent = (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100;
                    setProgress(progressPercent)
                    console.log(`Progress: ${progressPercent}`)
                }
            );

            const response = await uploadTask.uploadAsync();
            return response
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
        }
    }
    return { startUpload }
}
