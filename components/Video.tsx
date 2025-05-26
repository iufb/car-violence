import { Colors } from "@/constants/Colors";
import React from "react";

import { StyleSheet, View, ViewProps } from "react-native";
import VideoPlayer from 'react-native-video-player';
interface VideoProps extends ViewProps {
    source: string
}
export const Video = ({ source, style, ...props }: VideoProps) => {

    return (
        <View style={[style, styles.container]}>
            <VideoPlayer
                customStyles={{
                    seekBarKnob: {
                        backgroundColor: Colors.light.primary
                    },
                    seekBarProgress: {
                        backgroundColor: Colors.light.primary
                    },
                }}
                style={[styles.video]}
                source={{ uri: source }}

                thumbnail={{ uri: 'https://example.com/thumbnail.jpg' }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {

    },
    video: {
        width: '100%',
        height: '100%'
    },
    controlsContainer: {}
})
