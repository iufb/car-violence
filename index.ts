import messaging from '@react-native-firebase/messaging';
import "expo-router/entry";

messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Notifications.scheduleNotificationAsync({
    //     content: {
    //         title: remoteMessage.notification?.title + "Background",
    //         body: remoteMessage.notification?.body,
    //     },
    //     trigger: null, // Show immediately
    // });

    console.log('Message handled in the background!', remoteMessage);

});
