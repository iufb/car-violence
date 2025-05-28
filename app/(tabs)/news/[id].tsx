import { CustomHeader, ScreenContainer } from "@/components";
import { Tabs, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const width = Dimensions.get('window').width
export default function NewsScreen() {
    const { id } = useLocalSearchParams()
    console.log(id, 'ID')
    return <ScreenContainer keyDismiss={false}>
        <Tabs.Screen options={{ header: () => <CustomHeader title="Новости" /> }} />
        <WebView
            style={[styles.webview]}
            source={{ uri: `https://kto-ubil-marka.foxminded.space/detail/${id}` }}
        />
    </ScreenContainer>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    medias: {
        gap: 10,
    },
    mediaContainer: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').width - 40,
        borderRadius: 10,
        overflow: 'hidden'
    },
    media: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        gap: 10,
        paddingLeft: 10,
    }

})
