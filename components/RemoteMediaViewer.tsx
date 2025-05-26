import { getFileType } from "@/utils";
import { useState } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, View, ViewProps } from "react-native";

import { Video } from "@/components/Video";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import Constants from 'expo-constants';

import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get('window');
interface MediaViewerProps extends ViewProps {
    medias: string[]
    current: number;
    itemStyle: any
}
export const RemoteMediaViewer = ({ medias, current, itemStyle, ...props }: MediaViewerProps) => {
    const media = medias[current]
    const isLocal = typeof media !== 'string'
    const [uri, setUri] = useState(media)
    const [modalVisible, setModalVisible] = useState(false);
    const handleImgError = () => {
        setUri(
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJ5rAqr1pIi6pHOdFGGijRXcE4HLHqWJNSw&s'
        )
    }
    const closeModal = () => setModalVisible(false);
    return <View style={[props.style]} {...props}>
        <Pressable onPress={() => {
            if (isLocal) {
                if (getFileType(media) == 'image') {
                    setModalVisible(true)
                }
            } else {
                if (getFileType(media)) {
                    setModalVisible(true)
                }
            }

        }}>
            <View style={itemStyle}>



                {getFileType(media) == 'video' ?
                    <Video style={[styles.media]} source={uri} /> :
                    <Image style={[styles.media]} source={{ uri }} onError={handleImgError} />
                }

            </View>
        </Pressable>

        <Modal visible={modalVisible} onRequestClose={closeModal} animationType="fade"  >
            <Pressable onPress={closeModal} hitSlop={10} style={[styles.close]}>
                <AntDesign color={Colors.light.primary} size={32} name="close" />
            </Pressable>

            <ImageView medias={medias} current={current} />
        </Modal>
    </View>
}

interface ImageViewProps {
    current: number;
    medias: string[]
}

const ImageView = ({ current, medias }: ImageViewProps) => {
    const currentIndex = useSharedValue(current);
    console.log(medias)
    const translateX = useSharedValue(-current * width);

    const clampIndex = (index: number) => {
        'worklet';
        return Math.max(0, Math.min(medias.length - 1, index));
    };

    const onSwipeEnd = (offsetX: number) => {
        'worklet';
        const swipeRatio = offsetX / width;

        let nextIndex = currentIndex.value;

        if (swipeRatio > 0.1) {
            nextIndex = clampIndex(currentIndex.value - 1);
        } else if (swipeRatio < -0.1) {
            nextIndex = clampIndex(currentIndex.value + 1);
        } currentIndex.value = nextIndex;
        translateX.value = withTiming(-nextIndex * width, { duration: 140 });
    };

    const pan = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = -currentIndex.value * width + e.translationX;
        })
        .onEnd((e) => {
            onSwipeEnd(e.translationX);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={pan}>
                <Animated.View style={[{ width: medias.length * width }, styles.container, animatedStyle]}>
                    {medias.map((media, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            {
                                (getFileType(media) == 'image' ? <Image source={{ uri: media }} style={styles.image} resizeMode="contain" /> : <Video source={media} style={styles.video} />)
                            }

                        </View>
                    ))}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    media: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },
    modal: {
        paddingTop: Constants.statusBarHeight,
    },
    close: {
        position: 'absolute',
        right: 10,
        zIndex: 10,
        top: Constants.statusBarHeight
    },
    container: {
        flexDirection: 'row',
        height: '100%',
    },
    imageWrapper: {
        width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    video: {
        width: '100%',
        height: '90%',

    },

})
