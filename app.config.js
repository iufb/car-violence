export default {
    "expo": {
        "name": "OKO",
        "slug": "car-violence",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/icon.png",
        "scheme": "myapp",
        "userInterfaceStyle": "automatic",
        "newArchEnabled": true,

        "ios": {
            "bundleIdentifier": "com.ispark.oko"
        },

        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/images/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
            "package": "com.ispark.oko",
            "permissions": [
                "android.permission.RECORD_AUDIO",
                "android.permission.CAMERA"
            ]
        },

        "web": {
            "bundler": "metro",
            "output": "static",
            "favicon": "./assets/images/favicon.png"
        },
        "plugins": [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                }
            ],
            [
                "expo-video",
                {
                    "supportsBackgroundPlayback": true,
                    "supportsPictureInPicture": true
                }
            ],
            [
                "@sentry/react-native/expo",
                {
                    "organization": "bedroom-developers",
                    "project": "oko-app",
                    "url": "https://bedroom-developers.sentry.io/"
                }
            ],
            [
                "expo-secure-store",
                {
                    "configureAndroidBackup": true,
                    "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
                }
            ],
            [
                "expo-media-library",
                {
                    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
                    "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
                    "isAccessMediaLocationEnabled": true
                }
            ],
            [
                "react-native-vision-camera",
                {
                    "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera.",
                    "enableMicrophonePermission": true,
                    "microphonePermissionText": "$(PRODUCT_NAME) needs access to your Microphone."
                }
            ]
        ],
        "experiments": {
            "typedRoutes": true
        },
        "extra": {
            "router": {
                "origin": false
            },
            "eas": {
                "projectId": "a0ce8cd9-a4f0-4cec-8a01-e5f5d9632236"
            }
        },
        "runtimeVersion": {
            "policy": "appVersion"
        },
        "updates": {
            "url": "https://u.expo.dev/a0ce8cd9-a4f0-4cec-8a01-e5f5d9632236"
        }
    }
}
