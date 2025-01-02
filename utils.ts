import * as ImagePicker from 'expo-image-picker';
export const pickImage = async (saveSelected: (value: string[]) => void) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
    });


    if (!result.canceled) {
        saveSelected(result.assets.map(asset => asset.uri));
    }
};

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

    const result = `${day}.${month}.${year}`;
    return result
}
