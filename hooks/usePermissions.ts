
import { Modals } from "@/utils";
import { Camera as ExpoCamera, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const usePermissions = () => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [microPermissions, setMicroPermission] = useState<MediaLibrary.EXPermissionResponse | null>(null);
    const [loading, setLoading] = useState(true); // ✅ Start as true (loader on first render)

    const requestAllPermissions = async () => {
        setLoading(true); // ✅ Show loader while requesting
        try {
            const [cameraResponse, mediaResponse, microResponse] = await Promise.all([
                requestCameraPermission(),
                requestMediaPermission(),
                ExpoCamera.requestMicrophonePermissionsAsync(),
            ]);

            setMicroPermission(microResponse); // ✅ Update microphone permission state

            if (
                cameraResponse.status === "denied" ||
                mediaResponse.status === "denied" ||
                microResponse.status === "denied"
            ) {
                DeviceEventEmitter.emit(Modals.permission);
            }
        } catch (error) {
            console.error("Error requesting permissions:", error);
        } finally {
            setLoading(false); // ✅ Stop loader after request
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true); // ✅ Loader on first render
            const microResponse = await ExpoCamera.requestMicrophonePermissionsAsync();
            setMicroPermission(microResponse);
            setLoading(false); // ✅ Stop loader after first permission check
        })();
    }, []);

    return { cameraPermission, mediaPermission, microPermissions, requestAllPermissions, loading };
};

