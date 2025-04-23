import { DeviceHeigth } from "@/utils";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

interface useCreateModalProps {
    event: string;
}
export const useCreateModal = <T>({ event }: useCreateModalProps) => {
    const [visible, setVisible] = useState(false);
    const [callbacks, setCallbacks] = useState<T | null>(null)
    const y = useSharedValue(DeviceHeigth)
    const handleClose = () => {
        y.value = withTiming(DeviceHeigth, { duration: 300 }, () => {
            runOnJS(setVisible)(false)
        })
    };
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(event, (callbacks: T) => {
            y.value = DeviceHeigth
            setVisible(true);
            setCallbacks(callbacks)
            y.value = withTiming(0, { duration: 300 });
        });
        return () => listener.remove();
    }, []);

    return { y, visible, callbacks, handleClose }
}
