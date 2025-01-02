import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboardHeight = () => {
    const [height, setHeight] = useState(0)
    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setHeight(event.endCoordinates.height);
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            setHeight(0);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);
    return { keyboardHeight: height }
}
