import * as ImagePicker from 'expo-image-picker';

import * as SecureStore from 'expo-secure-store';
import { Dimensions } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast, { ToastType } from 'react-native-toast-message';
export const DeviceWidth = Dimensions.get('window').width
export const DeviceHeigth = Dimensions.get('window').height
export const pickImage = async ({
    saveAsUri,
    saveAsFile
}: {
    saveAsUri?: (value: string[]) => void,
    saveAsFile?: (value: ImagePicker.ImagePickerAsset[]) => void
}) => {    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
    });


    if (!result.canceled) {
        if (saveAsUri)
            saveAsUri(result.assets.map(asset => asset.uri));
        if (saveAsFile) {
            saveAsFile(result.assets)
        }
    }
};

export function hexToRgba(hex: string, alpha = 1) {
    // Ensure hex is in proper format (e.g., "#RRGGBB")
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);


    console.log(`rgba(${r},${g},${b},${alpha})`)
    return `rgba(${r},${g},${b},${alpha})`;
}
export const GetTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0'); // Ensures 2 digits
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures 2 digits

    const time = `${hours}:${minutes}`;
    return time
}
export const GetDate = (date: Date) => {

    const day = date.getDate().toString().padStart(2, '0'); // Ensures 2 digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed (0 = January, 11 = December)
    const year = date.getFullYear();

    const result = `${year}-${month}-${day}`;
    return result
}

export const rS = (value: number) => {
    return scale(value)
}
export const rV = (value: number) => {
    return verticalScale(value)
}
export const rMS = (value: number, factor?: number) => {
    return moderateScale(value, factor)
}

export function formatPhoneNumber(phone: string) {
    // Ensure the input is a string
    const cleaned = phone.toString().replace(/\D/g, ''); // Remove non-numeric characters

    // Check if the phone number has the correct length
    if (cleaned.length !== 11 || !cleaned.startsWith('7')) {
        throw new Error('Invalid phone number format');
    }

    // Format the phone number
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
}

type FileDetails = {
    fileName: string;
    mimeType: string;
};

export const getFileDetails = (fileUri: string): FileDetails | null => {
    if (!fileUri) {
        return null;
    }

    // Extract the file name from the URI
    const fileName = fileUri.split('/').pop();
    if (!fileName) {
        return null;
    }

    // Get the file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
        return null;
    }

    // Map of common file extensions to MIME types
    const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        webp: 'image/webp',
    };

    // Get the MIME type based on the extension
    const mimeType = mimeTypes[extension] || 'application/octet-stream'; // Default to binary data

    return {
        fileName,
        mimeType,
    };
};
export const showToast = ({ type, title, desc }: { type: ToastType, title: string, desc: string }) => {
    Toast.show({
        type,
        text1: title,
        text2: desc,
        text1Style: {
            fontSize: rS(15),
        },
        text2Style: {
            fontSize: rS(14),
        }

    });
}

export async function saveToStorage(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function getFromStorage(key: string) {
    const result = await SecureStore.getItemAsync(key);
    return result
}
export async function deleteFromStorage(key: string) {
    await SecureStore.deleteItemAsync(key);
}
export function getFileType(url: string) {
    // Define known image and video extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];

    try {
        // Create a new URL object to parse the URL
        const parsedUrl = new URL(url);
        // Extract the pathname from the URL
        const pathname = parsedUrl.pathname;
        // Extract the file extension by finding the last '.' and getting the substring after it
        const extension = pathname.split('.').pop()?.toLowerCase()

        // Check if the extension matches known image or video extensions
        if (extension && imageExtensions.includes(extension)) {
            return 'image';
        } else if (extension && videoExtensions.includes(extension)) {
            return 'video';
        } else {
            return 'unknown';
        }
    } catch (error) {
        console.error('Invalid URL:', error);
        return 'invalid';
    }
}


