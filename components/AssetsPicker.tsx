import { Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { DeviceHeigth, DeviceWidth, rS, rV } from "@/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Dimensions, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Easing, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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
    save(res[0])
}
export const AssetsPickerBtn = () => {
    const [permission, requestPermission] = MediaLibrary.usePermissions()
    const handlePicker = async () => {
        console.log(permission?.status, "STATUS")
        if (!permission) return;
        if (permission.status == 'denied') {
            DeviceEventEmitter.emit('openPermissionAlert')
            return;
        }
        if (permission.status !== 'granted') {
            const res = await requestPermission();
            console.log(res.status, 'ask status')
            if (res.status == 'granted') {
                DeviceEventEmitter.emit('openAssetsPicker', () => console.log('picker'))
            }
        } else {
            DeviceEventEmitter.emit('openAssetsPicker', () => console.log('picker'))
        }
    }

    return <Pressable onPress={handlePicker}>
        <Typography variant="h3">Picker</Typography>
    </Pressable>

}
export const AssetsPicker = () => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [visible, setVisible] = useState(false);
    const [saveCb, setSaveCb] = useState<(() => void) | null>(null)
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [pickedAssets, setSelectedMap] = useState<Map<string, MediaLibrary.Asset>>(new Map())
    const translateY = useSharedValue(0);
    const pan = Gesture.Pan()
        .onUpdate(e => {
            translateY.value = e.translationY
        })
        .onEnd(e => {
            if (e.translationY < 0) {
                translateY.value = withTiming(0, { duration: 100 })
            }
            if (e.translationY > DeviceHeigth / 2) {
                runOnJS(setVisible)(false)
            } else {
                translateY.value = withTiming(0, { duration: 100 })
            }

        })
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
        ],
    }));
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openAssetsPicker", (callback: () => void) => {
            translateY.value = withTiming(0, { duration: 300 })
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
    const onClose = () => {
        translateY.value = withTiming(DeviceHeigth, { duration: 300 }, () => {
            runOnJS(setVisible)(false)
        })
    }

    return visible && <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.3)', zIndex: 1, elevation: 1 }}>
        <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
            <GestureDetector gesture={pan}>
                <Animated.View style={[styles.container, animatedStyles]}>
                    <View style={[styles.top]} />
                    <View style={[styles.topView]}>
                        <Pressable hitSlop={20} onPress={onClose}>
                            <Typography color={Colors.light.primary} variant="p2">Назад  </Typography>
                        </Pressable>
                        <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />
                        <Pressable>
                            <Typography color={Colors.light.primary} variant="p2">Выбрать</Typography>
                        </Pressable>

                    </View>
                    {activeTab == tabs[0] ? <PhotosView pickedAssets={pickedAssets} handleSelect={handleSelect} /> : <VideosView pickedAssets={pickedAssets} handleSelect={handleSelect} />}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>

    </View>


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



const PhotosView = ({ pickedAssets, handleSelect }: AssetsPickerBase) => {
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([])
    useEffect(() => {
        getAssets('photo', (assets) => setPhotos(assets))
    }, [])
    return <View>
        <AssetsView pickedAssets={pickedAssets} assets={photos} handleSelect={handleSelect} />
    </View>
}

const VideosView = ({ pickedAssets, handleSelect }: AssetsPickerBase) => {
    const [videos, setVideos] = useState<MediaLibrary.Asset[]>([])
    useEffect(() => {
        getAssets('video', (assets) => setVideos(assets))
    }, [])
    return <View>
        <AssetsView pickedAssets={pickedAssets} assets={videos} handleSelect={handleSelect} />
    </View>

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
    return <Pressable onPress={() => handleSelect(asset)} style={{ position: 'relative', width: (DeviceWidth - 20) / 4, height: (DeviceWidth - 20) / 4 }}>
        {pickedAssets.has(asset.id) && <View style={{ position: 'absolute', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,.5)' }} >
            <View style={[{ marginTop: 4, marginLeft: 4, backgroundColor: Colors.light.primary, borderRadius: 100, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }]}>
                <FontAwesome name="check" color={'white'} size={15} />
            </View>
        </View>}
        <Image resizeMode="cover" source={{ uri: asset.uri }} width={DeviceWidth / 4} height={DeviceWidth / 4} />
    </Pressable >
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: "white", gap: rS(15), width: Dimensions.get("window").width, height: Dimensions.get('window').height, marginTop: rV(100), borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10,
    },
    top: {
        width: DeviceWidth - DeviceWidth / 1.5,
        height: rV(4),
        borderRadius: 10,
        marginTop: rV(5),
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,.33)'
    },
    topView: {
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
    }

})
