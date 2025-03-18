import { createContext, ReactNode, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface AppstateContext {
    appState: AppStateStatus
}


export const AppStateContext = createContext<AppstateContext>({ appState: AppState.currentState })


export const AppStateContextProvider = ({ children }: { children: ReactNode }) => {
    const [appState, setAppState] = useState(AppState.currentState);
    console.log(appState, 'APPSTATE')

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

