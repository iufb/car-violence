import { AppStateContext } from "@/context/AppStateContext";
import { useContext } from "react";

export const useAppState = () => {
    const { appState } = useContext(AppStateContext)
    return { appState }
}
