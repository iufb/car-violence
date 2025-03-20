import { Button, Typography } from '@/components/ui';

import { Colors } from '@/constants/Colors';
import { rS, rV } from '@/utils';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera as ExpoCamera } from 'expo-camera';
import Constants from "expo-constants";
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Dimensions, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/hooks';
import * as MediaLibrary from 'expo-media-library';
import { CameraPosition, Camera as CameraView, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';

type CameraModeType = 'picture' | 'video'
const CONTROLS_HEIGHT = 200

const saveToGallery = async (fileUri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        console.error("Permission to access media library denied.");
        return;
    }

    try {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        console.log("Asset created:", asset);
        return asset;
    } catch (error) {
        console.error("Error creating asset:", error);
    }
};
export function Camera({ setMedias, closeCameraOnEnd, medias, isActive }: { isActive: boolean, medias: MediaLibrary.Asset[], setMedias: (media: MediaLibrary.Asset[]) => void, closeCameraOnEnd: () => void }) {

    const { appState } = useAppState()
    const [cameraMode, setCameraMode] = useState<CameraModeType>('picture')
    const [facing, setFacing] = useState<CameraPosition>('back');
    const device = useCameraDevice(facing)
    const [isRecording, setIsRecording] = useState(false);
    const format = useCameraFormat(device, [
        { videoAspectRatio: 16 / 9 },
        { videoResolution: { width: 1920, height: 1080 } },
        { fps: 60 }
    ])
    const { width, height } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const path = usePathname()
    const router = useRouter()
    const cameraRef = useRef<CameraView>(null)

    const capturePhoto = async () => {
        try {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePhoto()
                const asset = await saveToGallery(photo.path)
                if (!asset) return;
                setMedias([asset])
                closeCameraOnEnd()
            }
        } catch (e) {
            console.log(e)
        }
    }
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    async function recordMedia() {
        try {
            if (cameraRef.current) {
                const microPermissions = await ExpoCamera.requestMicrophonePermissionsAsync()
                if (microPermissions.status === 'denied') {
                    DeviceEventEmitter.emit('openPermissionAlert')
                    return;
                }
                setIsRecording(true)
                cameraRef.current.startRecording({
                    onRecordingFinished: async (video) => {
                        const asset = await saveToGallery(video.path)
                        if (!asset) return
                        setMedias([asset])
                        setIsRecording(false)
                    },
                    onRecordingError: async (error) => {
                        setIsRecording(false)
                        if (cameraRef.current)
                            await cameraRef.current.cancelRecording()

                    }
                })
            }
        } catch (e) {
            console.log(e)
        }

    }
    async function stopRecord() {
        if (cameraRef.current) {
            await cameraRef.current.stopRecording()
            setIsRecording(false)
            setTimeout(() => {
                closeCameraOnEnd()
            }, 1000)
        }
    }
    const fn = () => {
        if (cameraMode == 'picture') {
            capturePhoto()
        } else {
            if (!isRecording) {
                recordMedia()
            }
            else {
                stopRecord()
            }
        }
    }
    const handleClose = () => {
        if (medias.length > 0) {
            closeCameraOnEnd()
            return;
        }
        router.back()
    }

    if (device == null) return <NoDeviceView />

    return (
        <View style={[{ paddingBottom: insets.bottom, paddingTop: Constants.statusBarHeight }]}>
            <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(100)} style={[styles.container]}>
                <CameraView style={[{ width, height: height - CONTROLS_HEIGHT - Constants.statusBarHeight }]} format={format} ref={cameraRef} device={device} isActive={isActive} photo video audio preview />

                <Pressable onPress={handleClose} style={[styles.close]}>
                    <MaterialCommunityIcons name='close' size={32} color='white' />
                </Pressable>

                <Controls facing={facing} toggleCameraFacing={toggleCameraFacing} save={(value) => {
                    setMedias(value)
                    closeCameraOnEnd()
                }} isRecording={isRecording} mode={cameraMode} selectMode={mode => {
                    setCameraMode(mode)
                    if (isRecording) {
                        stopRecord()
                    }
                }} capture={fn} />
            </Animated.View>

        </View>
    );
}
const CameraNotFound = ({ requestPermission }: { requestPermission: () => void }) => {
    const router = useRouter()
    return <View >
        <View >
            <Typography color={Colors.light.primary} center variant='h2'>Произошла ошибка</Typography>
            <Typography center variant='p1'>Камера не обнаружена</Typography>
            <Button onPress={() => router.back()}>Назад</Button>
        </View>
    </View>
}

const Controls = ({ facing, mode, selectMode, capture, save, isRecording, toggleCameraFacing }: CaptureBtnProps & FlipBtnProps & ImportBtnProps & ModeSelectorProps) => {
    return <View style={[styles.controls]}>
        <View style={[styles.topControls]}>
            <ImportBtn save={save} />
            <CaptureBtn mode={mode} capture={capture} isRecording={isRecording} />
            <FlipBtn facing={facing} toggleCameraFacing={toggleCameraFacing} />
        </View>
        <View style={[styles.bottomControls]}>
            <ModeSelector mode={mode} selectMode={selectMode} />
        </View>
    </View>

}
interface CaptureBtnProps {
    mode: CameraModeType, capture: () => void, isRecording: boolean
}
const CaptureBtn = ({ mode, capture, isRecording }: CaptureBtnProps) => {
    const size = useSharedValue(57)
    const radius = useSharedValue(100)
    const progress = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return { width: size.value, height: size.value, borderRadius: radius.value, borderWidth: isRecording ? 0 : 1 }
    })
    const colorStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [Colors.light.background, 'red'] // Transition from red to blue
        );
        return { backgroundColor };
    });
    useEffect(() => {
        progress.value = withTiming(mode == 'picture' ? 0 : 1, { duration: 500 });
    }, [mode])
    useEffect(() => {
        size.value = withSpring(isRecording ? 28 : 57);
        radius.value = withTiming(isRecording ? 10 : 100, { duration: 200 });
    }, [isRecording])
    return <View style={[styles.captureOuter]}>
        <Pressable onPress={capture}>
            <Animated.View style={[styles.captureInner, animatedStyle, colorStyle]} />
        </Pressable>
    </View>
}
interface FlipBtnProps {
    facing: CameraPosition
    toggleCameraFacing: () => void
}
const FlipBtn = ({ facing, toggleCameraFacing }: FlipBtnProps) => {
    const rotate = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        const rotation = interpolate(rotate.value, [0, 1], [1, 3])
        return { transform: [{ rotate: rotation + 'deg' }] }
    })
    //IOS- FIX rotate animation
    const flip = () => {
        rotate.value = withTiming(rotate.value == 0 ? 90 : 0,
        )
        toggleCameraFacing()
    }
    return <Pressable style={[styles.btn]} onPress={flip}>
        <Animated.View style={[animatedStyle]}>
            <FontAwesome6 name='arrows-rotate' size={24} color={Colors.light.background} />
        </Animated.View>
    </Pressable>

}
interface ImportBtnProps {
    save: (value: MediaLibrary.Asset[]) => void
}
const ImportBtn = ({ save }: ImportBtnProps) => {
    return <Pressable style={[styles.btn]} onPress={() => DeviceEventEmitter.emit('openAssetsPicker', { saveSelected: save })}><Entypo name='image' size={24} color={Colors.light.background} /></Pressable>
}

const modes: { label: string, value: CameraModeType }[] = [
    {
        label: "ФОТО", value: "picture"
    },
    {
        label: "ВИДЕО", value: "video"
    },
]
interface ModeSelectorProps {
    mode: CameraModeType, selectMode: (mode: CameraModeType) => void
}
const ModeSelector = ({ mode: selected, selectMode: select }: ModeSelectorProps) => {
    const translateX = useSharedValue(0)
    const { width } = useWindowDimensions()
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: `${translateX.value}%` }]
        }
    })
    useEffect(() => {
        translateX.value = withSpring(selected == 'picture' ? 11 : -9, { duration: 1000, stiffness: 10, dampingRatio: 1 })
    }, [selected])


    return <Animated.View style={[styles.modeSelector]} >
        <Pressable style={[styles.modePressable]} onPress={() => select(selected == 'video' ? 'picture' : 'video')} >
            <Animated.View style={[styles.modePressable, animatedStyle]}>
                {modes.map(mode =>
                    <Typography key={mode.label} color={selected == mode.value ? "#CD9C07" : Colors.light.background} variant='h3'>
                        {mode.label}
                    </Typography>
                )}</Animated.View></Pressable>

    </Animated.View>
}
const NoDeviceView = () => {
    const router = useRouter()
    return <View style={[styles.noDeviceContainer]}>
        <Tabs.Screen options={{ headerTitle: "Камера не найдена", headerShown: true }} />
        <View style={[styles.noDeviceForm]}>
            <Typography color={Colors.light.primary} center variant='h2'>Произошла ошибка</Typography>
            <Typography center variant='p1'>Камера не найдена.</Typography>
            <Button onPress={() => router.back()}>Вернуться назад</Button>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    controls: {
        paddingTop: 20,
        height: CONTROLS_HEIGHT,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: Platform.OS == 'ios' ? 'flex-start' : "center",
        gap: 20
    },
    close: {
        position: 'absolute',
        top: rV(10),
        right: rS(10)
    },
    toForm: {
        position: 'absolute',
        top: rV(10),
        left: rS(10)
    },

    back: {
        position: 'absolute',
        top: 20,
        left: 10
    },

    topControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    bottomControls: {
        width: '100%'
    },
    captureOuter: {
        width: 64, height: 64, backgroundColor: Colors.light.background, borderRadius: 100, justifyContent: 'center', alignItems: 'center'
    },
    captureInner: {
        width: 57, height: 57, backgroundColor: Colors.light.background, borderWidth: 2, borderColor: 'black'
    },
    btn: {
        width: 56, height: 56, backgroundColor: 'rgba(255,255,255,.2)', borderRadius: 100, justifyContent: 'center', alignItems: 'center'
    },
    modeSelector: {
        width: Dimensions.get('window').width,
        color: Colors.light.background,
        gap: 10,
    },
    modePressable: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 25,
    },
    pressable: {
        width: '100%', height: '100%'
    },
    noDeviceContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    noDeviceForm: {
        gap: 10,
        padding: 10
    }
});
