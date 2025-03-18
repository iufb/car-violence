import { Camera } from "@/components";
import { Tabs, usePathname, useRouter } from "expo-router";

import { SendViolenceForm } from "@/components/forms";
import { Button, Typography } from "@/components/ui";
import { useAppState } from "@/hooks";
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";


export default function Add() {
    const [medias, setMedias] = useState<MediaLibrary.Asset[]>([])
    const [activeView, setActiveView] = useState<'camera' | 'form' | 'initial'>('initial')
    const [permission, requestPermission] = useCameraPermissions();
    const { appState } = useAppState()
    const router = useRouter()
    const path = usePathname()
    useEffect(() => {
        if (path !== '/add') {
            if (medias.length > 0) {
                setActiveView('form')
            } else {
                setActiveView('initial')
            }

        }
        if (path == '/add' && medias.length === 0) {
            setActiveView('camera')
        }
    }, [path])


    useEffect(() => {
        if (activeView == 'camera' && appState == 'background') {
            setActiveView('initial')
            return
        }
        if (appState == 'active' && medias.length > 0) {
            setActiveView('form')
            return;
        }
        if (appState == 'active' && medias.length == 0) {
            setActiveView('camera')
            return;
        }

    }, [appState])


    const deleteMedia = (value: string) => {

        setMedias(prev => prev.filter(m => m.uri !== value))
    }
    useEffect(() => {
        if (medias.length == 0) {
            setActiveView('camera')
        }
    }, [medias])
    const closeCameraOnEnd = () => {
        setActiveView('form')
    }

    if (!permission) return <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Tabs.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>

    if (!permission.granted) return <PermissionsPage requestPermission={requestPermission} />
    return <View style={[styles.container]}>
        <Tabs.Screen options={{ headerShown: false }} />
        {activeView == 'camera' && <Camera medias={medias} isActive={activeView == 'camera'} setMedias={media => setMedias([...medias, ...media])} closeCameraOnEnd={closeCameraOnEnd} />}

        {activeView == 'form' && <SendViolenceForm setMedias={(m) => setMedias(m)} medias={medias} openCamera={() => setActiveView('camera')} />}

    </View>
}
const PermissionsPage = ({ requestPermission }: {
    requestPermission: () => Promise<MediaLibrary.EXPermissionResponse>
}) => {
    const router = useRouter()
    const getAccess = () => {
        requestPermission().then(res => {
            if (res.status == 'denied') {
                DeviceEventEmitter.emit('openPermissionAlert')
            }
        })
    }
    return <View style={[styles.permissionsContainer]}>
        <Tabs.Screen options={{ headerTitle: "Запрос разрешений", headerShown: true }} />
        <View style={[styles.permissionForm]}>
            <Typography color={Colors.light.primary} center variant='h2'>Запрос разрешений</Typography>
            <Typography center variant='p1'>Для корректной работы приложения необходимо разрешение на доступ к камере и микрофону.</Typography>
            <Typography variant='p2'>Нажмите "Разрешить", чтобы продолжить использование приложения.</Typography>
            <Button onPress={getAccess}>Разрешить</Button>
            <Button onPress={() => router.back()}>Назад</Button>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,.95)',
        flex: 1
    },
    permissionsContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center'
    },
    permissionForm: {
        gap: 10
    }


})
