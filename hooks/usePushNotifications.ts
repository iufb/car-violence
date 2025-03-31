
import { rRegisterDevice } from "@/api/auth";
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
    useEffect(() => {
        const fetchFCMToken = async () => {
            try {
                await messaging().registerDeviceForRemoteMessages();
                const fcmToken = await messaging().getToken();
                await registerForPushNotificationsAsync()
                const a = await rRegisterDevice({ registration_id: fcmToken, type: Platform.OS })
            } catch (error) {
                console.error("Error fetching FCM token:", error);
            }
        };
        fetchFCMToken();
    }, []);

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        const unsubscribeOnMessage = messaging().onMessage(
            async (remoteMessage) => {
                console.log("Foreground notification received:", remoteMessage);
                const notificationContent = remoteMessage.notification;

                Notifications.scheduleNotificationAsync({
                    content: {
                        title: notificationContent?.title + "Foreground",
                        body: notificationContent?.body,
                    },
                    trigger: null,
                });
            },
        );

        return () => {
            unsubscribeOnMessage();
        };
    }, []);
}
