import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useCreateModal = () => {
    const [visible, setVisible] = useState(false);
    const [saveCb, setSaveCb] = useState<(() => void) | null>(null)
    const handleClose = () => {
        setVisible(false)
    };
    useEffect(() => {
        const listener = DeviceEventEmitter.addListener("openAssetsPicker", (callback: () => void) => {
            setVisible(true);
            setSaveCb(() => callback)
        });
        return () => listener.remove();
    }, []);

    return { visible, setSaveCb, handleClose }
}
