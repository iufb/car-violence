import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface AppstateContext {
    appState: AppStateStatus
}


export const AppStateContext = createContext<AppstateContext>({ appState: AppState.currentState })


export const AppStateContextProvider = ({ children }: { children: ReactNode }) => {
    const [appState, setAppState] = useState(AppState.currentState);
    const lastChangeRef = useRef(null);
    console.log(appState, "APPSTGATE")

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    return <AppStateContext.Provider value={{ appState }} >{children}</AppStateContext.Provider>
}

