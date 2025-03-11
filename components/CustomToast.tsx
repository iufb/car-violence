
import { Typography } from '@/components/ui';
import { Progressbar } from '@/components/ui/Progressbar';
import { DeviceWidth } from '@/utils';
import { StyleSheet, View } from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';
interface CustomToastProps {
    progress: number
    fileName: string
}
export const CustomToast = ({ props: { fileName, progress } }: ToastConfigParams<CustomToastProps>) => {
    return (
        <View style={[styles.container]}>
            <Typography variant='h3'>Загрузка файла</Typography>
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
    }
})
