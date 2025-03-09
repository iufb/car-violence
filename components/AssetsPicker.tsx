import { Typography, ViewModal } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { DeviceWidth, pickAssets, rS, rV } from "@/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { LoaderView } from "@/components/LoaderView";
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from 'expo-media-library';
interface AssetsPickerBase {
    handleSelect: (asset: MediaLibrary.Asset) => void
    pickedAssets: Map<string, MediaLibrary.Asset>
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
    console.log(res, mediaType)
    save(res[0])
}
export const AssetsPickerBtn = () => {
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
    console.log("PICKED", assets)
    return <Pressable onPress={() => pickAssets((assets) => setAssets(assets))}>
        <Typography variant="h3">Picker</Typography>
    </Pressable>

}
export const AssetsPicker = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [visible, setVisible] = useState(false);
    const [saveCb, setSaveCb] = useState<((assets: MediaLibrary.Asset[]) => void) | null>(null)
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [pickedAssets, setSelectedMap] = useState<Map<string, MediaLibrary.Asset>>(new Map())
    useEffect(() => {
        if (visible) {
            requestPermission().then(res => {
                if (!res) return;
                console.log(res, "RES")
                if (res.status == 'denied') {
                    DeviceEventEmitter.emit('openPermissionAlert')
                    handleClose()
                    return;
                }
            })
        }
    }, [visible])
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openAssetsPicker", (callback: (assets: MediaLibrary.Asset[]) => void) => {
            setVisible(true);
            setSaveCb(() => callback)
        });

        return () => listener.remove();
    }, []);
    const handleSelect = (asset: MediaLibrary.Asset) => {
        setSelectedMap(prev => {
            const newMap = new Map(prev)
            if (newMap.has(asset.id)) {
                newMap.delete(asset.id)
            } else {
                newMap.set(asset.id, asset)
            }
            return newMap
        })
    }
    const handleClose = () => {
        setVisible(false)
    }
    const handleDone = () => {
        if (!saveCb) return;
        saveCb(Array.from(pickedAssets.values()))
        setSelectedMap(new Map())
        handleClose()
    }
    return <ViewModal visible={visible} handleClose={handleClose} modalOffset={rS(100)}>
        <View style={{ flex: 1 }}>
            <View style={[styles.topView]}>
                <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />
                <Pressable onPress={handleDone}>
                    <Typography color={Colors.light.primary} variant="p2">Выбрать</Typography>
                </Pressable>
            </View>
            {activeTab == tabs[0] ? <PhotosView pickedAssets={pickedAssets} handleSelect={handleSelect} /> : <VideosView pickedAssets={pickedAssets} handleSelect={handleSelect} />}
        </View>
    </ViewModal>
};
const tabs = ['Фото', 'Видео']
interface TabsProps {
    activeTab: string,
    setActiveTab: (tab: string) => void
}
const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
    const translateX = useSharedValue<number>(activeTab == tabs[0] ? 0 : rS(75) + 10);

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



const PhotosView = ({ pickedAssets, handleSelect }: AssetsPickerBase) => {
    const { loading, assets } = useMediaLibrary('photo')
    if (loading) return <LoaderView />
    if (assets.length == 0) return <Typography variant="p2" color="gray">Фото не найдены.</Typography>
    return <AssetsView pickedAssets={pickedAssets} assets={assets} handleSelect={handleSelect} />
}

const VideosView = ({ pickedAssets, handleSelect }: AssetsPickerBase) => {
    const { loading, assets } = useMediaLibrary('video')
    if (loading) return <LoaderView />
    if (assets.length == 0) return <Typography variant="p2" color="gray">Видео не найдены.</Typography>
    return <AssetsView pickedAssets={pickedAssets} assets={assets} handleSelect={handleSelect} />


}
const AssetsView = ({ assets, handleSelect, pickedAssets }: { assets: MediaLibrary.Asset[] } & AssetsPickerBase) => {
    return <FlatList
        data={assets}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item: asset }) =>
            <AssetItem asset={asset} pickedAssets={pickedAssets} handleSelect={handleSelect} />
        }
    />
}
interface AssetItemProps {
    asset: MediaLibrary.Asset
}
const AssetItem = ({ asset, handleSelect, pickedAssets }: AssetItemProps & AssetsPickerBase) => {
    return <Pressable onPress={() => handleSelect(asset)} style={[styles.asset]}>
        {pickedAssets.has(asset.id) && <View style={[styles.assetOverlay]} >
            <View style={[styles.check]}>
                <FontAwesome name="check" color={'white'} size={12} />
            </View>
        </View>}
        <Image resizeMode="cover" source={{ uri: asset.uri }} width={DeviceWidth / 4} height={DeviceWidth / 4} />
    </Pressable >
}
const useMediaLibrary = (mediaType: MediaLibrary.MediaTypeValue) => {
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getAssets(mediaType, (a) => setAssets(a))
        setLoading(false)
    }, [])
    return { assets, loading }
}
const styles = StyleSheet.create({
    topView: {
        marginLeft: DeviceWidth / 4,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tabs: {
        position: 'relative',
        maxWidth: DeviceWidth / 2,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#e2e2e2',
        paddingVertical: rV(5),
        borderRadius: 10,
    },
    tabsContent: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: rV(3),
        alignSelf: 'flex-start',
    },
    tab: {
        width: rS(75),
        alignSelf: 'center',
    },
    check: { marginTop: 8, marginLeft: 8, backgroundColor: Colors.light.primary, borderRadius: 100, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
    asset: { position: 'relative', width: (DeviceWidth - 20) / 4, height: (DeviceWidth - 20) / 4, overflow: 'hidden' },
    assetOverlay: { position: 'absolute', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,.5)' }


})
