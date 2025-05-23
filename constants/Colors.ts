/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const mockCardData = [
    {
        title: "Mountain Adventure",
        subtitle: "Explore the Uncharted Peaks",
        desc: "Experience the thrill of hiking through breathtaking mountain trails. Join us for an unforgettable adventure in the wilderness.",
        img: "https://example.com/images/mountain.jpg"
    },
    {
        title: "Ocean Breeze",
        subtitle: "Relax by the Seaside",
        desc: "Feel the sand between your toes and the ocean breeze on your face as you relax by the seaside with our exclusive beach retreat.",
        img: "https://example.com/images/ocean.jpg"
    },
    {
        title: "City Lights",
        subtitle: "Discover Urban Wonders",
        desc: "Embark on a journey through the vibrant city life, filled with cultural landmarks, delicious food, and endless entertainment.",
        img: "https://example.com/images/city.jpg"
    },
    {
        title: "Forest Escape",
        subtitle: "Reconnect with Nature",
        desc: "Escape the hustle and bustle of city life and immerse yourself in the peaceful serenity of a lush forest getaway.",
        img: "https://example.com/images/forest.jpg"
    },
    {
        title: "Desert Mirage",
        subtitle: "Adventure in the Sand Dunes",
        desc: "Venture into the vast desert landscape for a once-in-a-lifetime experience of camel rides, stargazing, and desert camping.",
        img: "https://example.com/images/desert.jpg"
    }
];
const primaryLight = '#007AFF';
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text: '#1E1E1E',
        background: '#fff',
        primary: primaryLight,
        notSelected: '#8B8C92',
        selected: primaryLight,
        slate200: "#F1F5F9",
        gray: "#d4d4d4",
        borderColor: "#C5C6CC",
        cardBg: "#E0F2FE",
        status: {
            0: "#ffe2e4",
            1: "#fff4e4",
            2: "#e7f4e8",
            3: "#eaf2ff"
        },
        statusText: {
            0: "#B91C1C",
            1: "#92400E",
            2: "#065F46",
            3: "#1D4ED8"

        },
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
    },
};
