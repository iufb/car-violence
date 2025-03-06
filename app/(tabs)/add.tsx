import { Camera } from "@/components";
import { Tabs, usePathname, useRouter } from "expo-router";

import { SendViolenceForm } from "@/components/forms";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type ViewType = 'camera' | 'form'

export default function Add() {
    const [medias, setMedias] = useState<string[]>([])
    const [view, setView] = useState<ViewType>('camera')
    const router = useRouter()
    console.log(medias)
    const path = usePathname()
    useEffect(() => {
        if (path !== '/add') {
            setView('form')
        }
        if (path == '/add' && medias.length === 0) {
            setView('camera')
        }
    }, [path])

    const deleteMedia = (value: string) => {

        setMedias(prev => prev.filter(m => m !== value))
    }
    useEffect(() => {
        if (medias.length == 0) {
            setView('camera')
        }
    }, [medias])
    const closeCameraOnEnd = () => {
        setMedias(prev => {
            if (prev.length === 0) {
                router.push('/')
            } else {
                setView('form')
            }
            return prev
        })
    }
    return <View style={[styles.container]}>
        <Tabs.Screen options={{ headerShown: false }} />
        {view == 'camera' && <Camera medias={medias} isActive={view == 'camera'} setMedias={media => setMedias([...medias, ...media])} closeCameraOnEnd={closeCameraOnEnd} />}
        {view == 'form' &&
            <SendViolenceForm setMedias={(value) => setMedias(() => {
                return value
            })} medias={medias} openCamera={() => setView('camera')} />
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,.95)',
        paddingTop: Constants.statusBarHeight,
        flex: 1
    }
})
