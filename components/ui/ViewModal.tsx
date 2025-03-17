import { DeviceHeigth, DeviceWidth, rS, rV } from '@/utils';
import React, { cloneElement, forwardRef, ReactElement, ReactNode, useEffect, useImperativeHandle } from 'react';
import { Dimensions, PressableProps, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
interface ViewModalProps {
    visible: boolean, handleClose: () => void
    children: ReactNode
    modalOffset: number
    doneBtn?: ReactElement<PressableProps>
}
const ViewModal = forwardRef(({ visible, handleClose, doneBtn, children, modalOffset }: ViewModalProps, ref) => {
    const translateY = useSharedValue(0);

    const onClose = () => {
        translateY.value = withTiming(DeviceHeigth, { duration: 300 }, () => {
            runOnJS(handleClose)()
        })
    }
    useImperativeHandle(ref, () => ({
        close: onClose,
    }));
    const pan = Gesture.Pan()
        .onUpdate(e => {
            translateY.value = e.translationY
        })
        .onEnd(e => {
            if (e.translationY < 0) {
                translateY.value = withTiming(0, { duration: 100 })
            }
            if (e.translationY > (DeviceHeigth - modalOffset) / 2) {
                runOnJS(onClose)()
            } else {

                translateY.value = withTiming(0, { duration: 100 })
            }

        })
    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
            ],
        }
    }
    );
    useEffect(() => {
        if (!visible) {
            translateY.value = withTiming(DeviceHeigth - modalOffset, { duration: 300 })
        }
        if (visible) {
            translateY.value = withTiming(0, { duration: 300 })
        }
    }, [visible])

    return visible && <View style={[styles.overlay]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TouchableOpacity onPress={onClose} style={[{ height: modalOffset }]} />
            <GestureDetector gesture={pan}>
                <Animated.View style={[styles.container, animatedStyles]}>
                    <View style={[styles.top]} />
                    {React.isValidElement(doneBtn)
                        ? cloneElement(doneBtn, {
                            onPress: (e) => {
                                if (doneBtn) {
                                    const { onPress } = doneBtn.props
                                    if (onPress) {
                                        onPress(e)
                                    }
                                }
                                onClose()
                            }
                        }) : doneBtn}
                    {children}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    </View>

});
export default ViewModal
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.3)', zIndex: 1, elevation: 1
    },
    close: {
        position: 'absolute', left: 30, top: 50
    },
    container: {
        position: 'relative',
        backgroundColor: "white", gap: rS(15), width: Dimensions.get("window").width, height: DeviceHeigth * 2, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10,
    },
    top: {
        width: DeviceWidth - DeviceWidth / 1.5,
        height: rV(4),
        borderRadius: 10,
        marginTop: rV(5),
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,.33)'
    },

})
