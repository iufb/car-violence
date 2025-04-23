import { DeviceHeigth, DeviceWidth, rS, rV } from '@/utils';
import React, { cloneElement, ReactElement, ReactNode, useEffect } from 'react';
import { Dimensions, PressableProps, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
interface ViewModalProps {
    y: SharedValue<number>
    visible: boolean, handleClose: () => void
    children: ReactNode
    modalOffset: number
    doneBtn?: ReactElement<PressableProps>
}
export const ViewModal = ({ y, visible, handleClose, doneBtn, children, modalOffset }: ViewModalProps) => {

    const pan = Gesture.Pan()
        .onUpdate(e => {
            if (e.translationY > 0) {
                y.value = e.translationY
            }
        })
        .onEnd(e => {
            if (e.translationY < 0) {
                y.value = withTiming(0, { duration: 100 })
            }
            if (e.translationY > (DeviceHeigth - modalOffset) / 2) {
                runOnJS(handleClose)()
            } else {

                y.value = withTiming(0, { duration: 100 })
            }

        })
    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: y.value },
            ],
        }
    }
    );
    useEffect(() => {
        if (visible) {
            y.value = withTiming(0, { duration: 300 })
        } else {
            y.value = withTiming(DeviceHeigth - modalOffset, { duration: 300 })
        }
    }, [visible])

    return visible ? <View style={[styles.overlay]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={{ height: modalOffset }} pointerEvents="box-only" />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.container, animatedStyles]}>

                <GestureDetector gesture={pan} >
                    <View style={[styles.topContainer]}>
                        <View style={[styles.top]} />
                    </View>
                </GestureDetector>
                {React.isValidElement(doneBtn)
                    ? cloneElement(doneBtn, {
                        onPress: (e) => {
                            if (doneBtn) {
                                const { onPress } = doneBtn.props
                                if (onPress) {
                                    onPress(e)
                                }
                            }
                            handleClose()
                        }
                    }) : doneBtn}
                {children}
            </Animated.View>
        </GestureHandlerRootView>
    </View> : <View />

};
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.3)', zIndex: 1, elevation: 1
    },
    close: {
        position: 'absolute', left: 30, top: 50
    },
    container: {
        position: 'relative',
        backgroundColor: "white", gap: rS(15), width: Dimensions.get("window").width, flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', padding: 10,
    },
    topContainer: {
        paddingVertical: rS(10)
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
