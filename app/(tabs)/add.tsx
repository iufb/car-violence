import { Camera } from "@/components";
import { Tabs, useRouter } from "expo-router";

import { SendViolenceForm } from "@/components/forms";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
type ViewType = 'camera' | 'form'

export default function Add() {
    const [medias, setMedias] = useState<string[]>([])
    const [view, setView] = useState<ViewType>('camera')
    const router = useRouter()
    const deleteMedia = (value: string) => {

        setMedias(prev => prev.filter(m => m !== value))
    }
    useEffect(() => {
        if (medias.length == 0) {
            setView('camera')
        }
    }, [medias])
    return <View style={[styles.container]}>
        <Tabs.Screen options={{ headerShown: false }} />
        {view == 'camera' &&
            <Camera setMedias={media => setMedias([...medias, ...media])} closeCameraOnEnd={() => {
                if (medias.length == 0) {
                    router.push('/')
                } else {
                    setView('form')
                }
            }} />}
        {view == 'form' && <View>
            <SendViolenceForm setMedias={(value) => setMedias(value)} medias={medias} openCamera={() => setView('camera')} />
        </View>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,.95)',
        paddingTop: Constants.statusBarHeight,
        justifyContent: 'space-between',
        height: '100%',
    }
})
