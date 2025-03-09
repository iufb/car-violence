import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';

import { AssetsPicker } from '@/components/AssetsPicker';
import { toastConfig } from '@/components/CustomToast';
import { PermissionAlert } from '@/components/PermissionAlert';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isRunningInExpoGo } from 'expo';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});



export const client = new QueryClient()
Sentry.init({
    dsn: 'https://e57e7175a1d55d2ffe56d50bedd0d2a5@o4508606759829504.ingest.de.sentry.io/4508606788993104',
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    environment: '',
    tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
    integrations: [
        // Pass integration
        navigationIntegration,
    ],
    enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

const InitialLayout = () => {

    const router = useRouter();
    const { isLoaded, isSignedIn, isFirstBoot } = useAuth();
    const segments = useSegments();
    const pathname = usePathname();

    useEffect(() => {
        const redirect = async () => {

            if (!isLoaded) return;
            if (isFirstBoot) {
                router.replace('/onbording');
                return;
            }
            if (isSignedIn) {
                router.replace('/');
                return;
            }
            if (!isSignedIn) {
                router.replace('/(auth)/login');
            }
        }
        redirect()

    }, [isLoaded]);

    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
        );
    }
    return <>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </>
}
function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const ref = useNavigationContainerRef();
    useEffect(() => {
        if (ref?.current) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);
    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <QueryClientProvider client={client}>
                <InitialLayout />
            </QueryClientProvider>
            <Toast config={toastConfig} />
            <AssetsPicker />
            <PermissionAlert />
        </ThemeProvider>
    );
}
export default Sentry.wrap(RootLayout)
