
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

const showNotification = (title?: string, message?: string) => {
    Notifications.scheduleNotificationAsync({
        content: { title, body: message },
        trigger: null, // Show notification immediately
    });
};
async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    console.log(finalStatus);

    if (finalStatus !== "granted") {
        alert("Включите уведомления чтобы создавать напоминания");
        return;
    }
}
export const usePushNotifications = () => {
    //getToken + permission
    useEffect(() => {
        const fetchFCMToken = async () => {
            try {
                await messaging().registerDeviceForRemoteMessages();
                const fcmToken = await messaging().getToken();
                console.log("FCM Token:", fcmToken);
                await registerForPushNotificationsAsync()

                // TODO: Save token to your backend, if needed
            } catch (error) {
                console.error("Error fetching FCM token:", error);
            }
        };
        fetchFCMToken();
    }, []);

    //Lister foreground
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        // Handle foreground notifications (when the app is active)
        const unsubscribeOnMessage = messaging().onMessage(
            async (remoteMessage) => {
                console.log("Foreground notification received:", remoteMessage);
                const notificationContent = remoteMessage.notification;

                // Display a notification or handle the message while the app is in the foreground
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: notificationContent?.title + "Foreground",
                        body: notificationContent?.body,
                    },
                    trigger: null, // Show immediately
                });
            },
        );

        // Clean up subscriptions
        return () => {
            unsubscribeOnMessage();
        };
    }, []);
}
