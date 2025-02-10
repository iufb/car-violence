import { Typography } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { pickImage } from '@/utils';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraType, CameraView, Camera as ExpoCamera, useCameraPermissions } from 'expo-camera';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CameraModeType = 'picture' | 'video'
const CONTROLS_HEIGHT = 200

export function Camera({ medias, setMedias, closeCameraOnEnd }: { medias: string[], setMedias: (media: string[]) => void, closeCameraOnEnd: () => void }) {
    const [cameraMode, setCameraMode] = useState<CameraModeType>('picture')
    const [facing, setFacing] = useState<CameraType>('back');
    const [isRecording, setIsRecording] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const { width, height } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const path = usePathname()
    const router = useRouter()
    const cameraRef = useRef<CameraView>(null)

    useEffect(() => {
        if (!permission || !permission.granted) {
            requestPermission()
        }
    }, [permission])

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    async function capturePhoto() {
        try {
            let photo = await cameraRef.current?.takePictureAsync()
            console.log(photo)
            setMedias([photo?.uri ?? ""])
            closeCameraOnEnd()
        } catch (e) {
            console.log(e)
        }
    }
    async function recordMedia() {
        try {
            await ExpoCamera.requestMicrophonePermissionsAsync()
            setIsRecording(true)
            let recording = await cameraRef.current?.recordAsync()
            setMedias([recording?.uri ?? ""])
            console.log(recording)
        } catch (e) {
            console.log(e)
        }

    }
    async function stopRecord() {
        cameraRef.current?.stopRecording()
        setIsRecording(false)
        setTimeout(() => {
            closeCameraOnEnd()
        }, 1000)
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

    return (
        <View style={[{ paddingBottom: insets.bottom }]}>
            <View style={[styles.container]}>
                <CameraView videoQuality='1080p' ref={cameraRef} style={[{ width, height: height - CONTROLS_HEIGHT }]} facing={facing} mode={cameraMode} >
                    {medias.length > 0 &&
                        <Pressable hitSlop={30} onPress={() => closeCameraOnEnd()} style={[styles.back]}>
                            <MaterialCommunityIcons name='chevron-left' size={32} color='white' />
                        </Pressable>
                    }
                    <Pressable hitSlop={30} onPress={() => router.back()} style={[styles.close]}>
                        <MaterialCommunityIcons name='close' size={32} color='white' />
                    </Pressable>
                </CameraView>
                <Controls facing={facing} toggleCameraFacing={toggleCameraFacing} save={(value) => {
                    setMedias(value)
                    closeCameraOnEnd()
                }} isRecording={isRecording} mode={cameraMode} selectMode={mode => {
                    setCameraMode(mode)
                    if (isRecording) {
                        stopRecord()
                    }
                }} capture={fn} />
            </View>

        </View>
    );
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
    facing: "back" | 'front'
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
    save: (value: string[]) => void
}
const ImportBtn = ({ save }: ImportBtnProps) => {
    return <Pressable style={[styles.btn]} onPress={() => pickImage(save)}><Entypo name='image' size={24} color={Colors.light.background} /></Pressable>
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

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        top: 20,
        right: 20
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

});
