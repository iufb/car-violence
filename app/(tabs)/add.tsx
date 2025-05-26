import { Camera } from "@/components";
import { Stack, Tabs, usePathname, useRouter } from "expo-router";

import { SendViolenceForm } from "@/components/forms";
import { Button, Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useMediaStore } from "@/context/useMediaStore";
import { useAppState } from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
export default function EntryPoint() {
    const { cameraPermission, mediaPermission, microPermissions, requestAllPermissions, loading } = usePermissions()
    if (loading) return <View style={[{ flex: 1, backgroundColor: 'black' }]} ><Stack.Screen options={{ headerShown: false }} /></View>
    if (cameraPermission?.granted && mediaPermission?.granted && microPermissions?.granted) {
        return <Add />
    }
    return <PermissionsPage requestPermission={requestAllPermissions} />
}

function Add() {
    const { appState } = useAppState()
    const router = useRouter()
    const path = usePathname()

    const {
        medias,
        activeView,
        setActiveView,
        setMedias,
    } = useMediaStore()
    useEffect(() => {
        if (appState === 'background') {
            setActiveView('loader')
        } else {
            if (medias.length > 0) {
                setActiveView('form')
            } else {
                setActiveView('camera')
            }
        }
    }, [appState])


    useEffect(() => {
        if (medias.length === 0) {
            setActiveView('camera')
        }
    }, [medias])


    if (activeView == 'loader') {
        return <View style={[{ flex: 1, backgroundColor: 'black' }]} />
    }

    return <View style={[styles.container]}>
        <Tabs.Screen options={{ headerShown: false }} />
        {activeView == 'camera' && <Camera />}
        {activeView == 'form' && <SendViolenceForm />}
    </View>
}
const PermissionsPage = ({ requestPermission }: {
    requestPermission: () => Promise<void>
}) => {
    const router = useRouter()
    const getAccess = () => {
        requestPermission()
    }
    return <View style={[styles.permissionsContainer]}>
        <Tabs.Screen options={{ headerTitle: "Запрос разрешений", headerStyle: { backgroundColor: 'black' }, headerTintColor: 'white', headerShown: true }} />
        <View style={[styles.permissionForm]}>
            <Typography color={Colors.light.primary} center variant='h2'>Запрос разрешений</Typography>
            <Typography color="white" center variant='p1'>Для корректной работы приложения необходимо разрешение на доступ к камере и микрофону.</Typography>
            <Typography color="white" variant='p2'>Нажмите "Разрешить", чтобы продолжить использование приложения.</Typography>
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
        backgroundColor: 'black',
        padding: 20,
        justifyContent: 'center'
    },
    permissionForm: {
        gap: 10
    }


})
