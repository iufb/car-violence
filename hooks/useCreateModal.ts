import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

interface useCreateModalProps {
    event: string;
}
export const useCreateModal = <T>({ event }: useCreateModalProps) => {
    const [visible, setVisible] = useState(false);
    const [callbacks, setCallbacks] = useState<T | null>(null)
    const handleClose = () => {
        setVisible(false)
    };
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(event, (callbacks: T) => {
            setVisible(true);
            setCallbacks(callbacks)
        });
        return () => listener.remove();
    }, []);

    return { visible, callbacks, handleClose }
}
