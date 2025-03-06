import { Button } from "@/components/ui";
import { rV } from "@/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface AssetsPickerBase {
    handlePick: () => void
}
export const AssetsPicker = () => {
    const [visible, setVisible] = useState(false);
    const [saveCb, setSaveCb] = useState<(() => void) | null>(null)

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openAssetsPicker", (callback: () => void) => {
            setVisible(true);
            setSaveCb(() => callback)
        });

        return () => listener.remove();
    }, []);

    return visible && <GestureHandlerRootView><Modal visible={visible} transparent={true} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={[styles.container]}>
            <View style={[styles.top]} />

            <Button>123</Button>
            <Tabs />
        </View>
    </Modal></GestureHandlerRootView>

};

const Tabs = () => {
    return <View>
        <Text></Text>
    </View>

}
const PhotosView = ({ }: AssetsPickerBase) => { }

const VideosView = ({ }: AssetsPickerBase) => { }

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: "#A0B4C2", width: Dimensions.get("window").width, height: Dimensions.get('window').height - rV(100), marginTop: rV(100), borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10
    },
    top: {
        position: 'absolute',
        width: Dimensions.get('window').width - 100,
        height: rV(4),
        borderRadius: 10,
        marginTop: rV(10),
        alignSelf: 'center',
        backgroundColor: 'black'
    }

})
