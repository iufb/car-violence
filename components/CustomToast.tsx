
import { Typography } from '@/components/ui';
import { Progressbar } from '@/components/ui/Progressbar';
import { Colors } from '@/constants/Colors';
import { DeviceWidth } from '@/utils';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Toast, { ToastConfigParams } from 'react-native-toast-message';
interface CustomToastProps {
    progress: number
    fileName: string
    cancel: () => Promise<void>
}
export const CustomToast = ({ props: { fileName, progress, cancel } }: ToastConfigParams<CustomToastProps>) => {
    return (
        <View style={[styles.container]}>
            <Typography variant='h3'>Загрузка файла</Typography>
            <Pressable style={[styles.close]} onPress={() => {
                cancel().finally(() => Toast.hide())
            }}><FontAwesome color={Colors.light.primary} name='close' size={20} /></Pressable>
            <Typography numberOfLines={1} variant='p2'>{fileName.length > 40 ? fileName.slice(0, 40) + '...' : fileName}</Typography>
            <Progressbar value={progress} />
            <Typography center color="black" variant="h3">{progress}%</Typography>
        </View>
    );
};
export const toastConfig = {
    upload: (params: ToastConfigParams<CustomToastProps>) => {
        return <CustomToast {...params} />
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: DeviceWidth - 20,
        gap: 10,
        marginHorizontal: 'auto',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.53,
        shadowRadius: 13.97,

        elevation: 21,
    },
    close: {
        elevation: 22,
        zIndex: 22,
        position: 'absolute',
        right: 10,
        top: 10
    }
})
