import { rCheckToken } from "@/api/auth";
import { getFromStorage } from "@/utils";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";

const checkFirstBoot = async () => {
    // await SecureStore.deleteItemAsync('isFirstBoot')
    const isFirstBoot = await SecureStore.getItemAsync('isFirstBoot')
    if (!isFirstBoot) {
        return true
    } else {
        return false
    }
}
export const useAuth = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isFirstBoot, setIsFirstBoot] = useState(false)
    const [isSignedIn, setIsSignedIn] = useState(false)
    useEffect(() => {
        const check = async () => {
            const boot = await checkFirstBoot()
            console.log(boot, "BOOT")
            if (boot) {
                setIsFirstBoot(true)
                setIsLoaded(true)
                return;
            }
            const access = await getFromStorage('access')
            if (!access) {
                setIsSignedIn(false)
                setIsLoaded(true)
                return;
            }

            rCheckToken().then(() => {
                console.log('success check')
                setIsSignedIn(true)
            }).catch((e) => {
                console.log("error check", e)
            }).finally(() => setIsLoaded(true))
        }
        check()
    }, [])
    return { isLoaded, isSignedIn, isFirstBoot }
}
