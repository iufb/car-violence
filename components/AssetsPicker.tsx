import { Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { DeviceWidth, rS, rV } from "@/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import * as MediaLibrary from 'expo-media-library';
interface AssetsPickerBase {
    handleSelect: (asset: MediaLibrary.Asset) => void
}
const getAssets = async (mediaType: MediaLibrary.MediaTypeValue, save: (assets: MediaLibrary.Asset[]) => void) => {
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
    });
    let promises: Promise<MediaLibrary.PagedInfo<MediaLibrary.Asset>>[] = []
    fetchedAlbums.forEach(async (album) => {
        promises.push(MediaLibrary.getAssetsAsync({ album, mediaType }))
    })
    const res = (await Promise.all(promises)).map(page => page.assets)
    save(res[0])
}
export const AssetsPicker = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [visible, setVisible] = useState(false);
    const [saveCb, setSaveCb] = useState<(() => void) | null>(null)
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [selectedMap, setSelectedMap] = useState<Map<string, MediaLibrary.Asset>>(new Map())

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openAssetsPicker", (callback: () => void) => {
            setVisible(true);
            setSaveCb(() => callback)
        });

        return () => listener.remove();
    }, []);
    const handleSelect = (asset: MediaLibrary.Asset) => {
        setSelectedMap(prev => {
            const newMap = new Map(prev)
            newMap.set(asset.id, asset)
            return newMap
        })
    }

    return visible && <GestureHandlerRootView><Modal visible={visible} transparent={true} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={[styles.container]}>
            <View style={[styles.top]} />
            <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />
            {activeTab == tabs[0] ? <PhotosView handleSelect={handleSelect} /> : <VideosView handleSelect={handleSelect} />}
        </View>
    </Modal></GestureHandlerRootView>

};
const tabs = ['Фото', 'Видео']
interface TabsProps {
    activeTab: string,
    setActiveTab: (tab: string) => void
}
const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
    const translateX = useSharedValue<number>(0);

    const handlePress = (tab: string) => {
        setActiveTab(tab)
        translateX.value = tab !== tabs[0] ? rS(75) + 10 : 0
    };

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(translateX.value, {
                duration: 200,
                easing: Easing.linear,
                reduceMotion: ReduceMotion.System,
            })
        }],
    }));
    return <View style={[styles.tabs]} >
        <View style={[styles.tabsContent]}>
            <Animated.View style={[{ position: 'absolute', backgroundColor: Colors.light.primary, width: rS(75), paddingVertical: rV(12), pointerEvents: 'none', borderRadius: 10 }, animatedStyles]} />
            {tabs.map(t => <Pressable onPress={() => handlePress(t)} style={[styles.tab]} key={t}><Typography center color={activeTab == t ? 'white' : 'gray'} variant="h3">{t}</Typography></Pressable>)}
        </View>
    </View>

}



const PhotosView = ({ }: AssetsPickerBase) => {
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([])
    useEffect(() => {
        getAssets('photo', (assets) => setPhotos(assets))
    }, [])
    console.log(photos, "PHOTOS")
    return <View>
        <Typography variant="h2">Photos</Typography>
        <AssetsView assets={photos} />
    </View>
}

const VideosView = ({ }: AssetsPickerBase) => {
    return <View>
        <Typography variant="h2">Videos</Typography>
    </View>

}
const AssetsView = ({ assets }: { assets: MediaLibrary.Asset[] }) => {
    return <FlatList
        data={assets}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item: asset }) =>
            <AssetItem asset={asset} />
        }
    />
}
interface AssetItemProps {
    asset: MediaLibrary.Asset
}
const AssetItem = ({ asset }: AssetItemProps) => {
    return <Image key={asset.id} source={{ uri: asset.uri }} width={DeviceWidth / 4} height={DeviceWidth / 4} />
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: "white", width: Dimensions.get("window").width, height: Dimensions.get('window').height - rV(100), marginTop: rV(100), borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10,
    },
    top: {
        width: DeviceWidth - 100,
        height: rV(4),
        borderRadius: 10,
        marginVertical: rV(10),
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,.7)'
    },
    tabs: {
        maxWidth: DeviceWidth,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tabsContent: {
        flexDirection: 'row',
        gap: 10,
        alignSelf: 'flex-start',
    },
    tab: {
        width: rS(75),
        alignSelf: 'center',
    }

})
